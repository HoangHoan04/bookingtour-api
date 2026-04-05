import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import moment from 'moment-timezone';
import * as qs from 'qs';
import { enumData } from 'src/common/constants';
import { IdDto } from 'src/dto';
import { CodeType } from 'src/helpers/generateCode.config';
import { GenerateCodeHelper } from 'src/helpers/generateCodeHelper';
import { BookingRepository, PaymentRepository } from 'src/repositories';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,

    private readonly bookingRepo: BookingRepository,

    private readonly paymentRepo: PaymentRepository,

    private readonly actionLogService: ActionLogService,
  ) {}

  async createVnpayPayment(data: IdDto) {
    const booking = await this.bookingRepo.findOne({
      where: { id: data.id },
    });

    if (!booking) {
      throw new NotFoundException('Booking không tồn tại');
    }

    if (booking.status !== enumData.BOOKING_STATUS.PENDING.code) {
      throw new BadRequestException('Booking không hợp lệ để thanh toán');
    }

    const paymentCode = await GenerateCodeHelper.generate(
      CodeType.PAYMENT,
      this.paymentRepo,
    );
    const paymentData = this.paymentRepo.create({
      code: paymentCode,
      amount: booking.finalPrice,
      method: 'VNPAY',
      status: enumData.PAYMENT_STATUS.PENDING.code,
      bookingId: booking.id,
      createdBy: 'system',
    });

    const payment = await this.paymentRepo.save(paymentData);
    if (!payment.id) {
      throw new BadRequestException('Failed to create payment record');
    }

    const txnRef = payment.code;

    const actionLogDto: ActionLogCreateDto = {
      functionId: payment.id,
      functionType: 'Payment',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: '473c9379-e4e9-4284-a03d-8bb87cbd6abf',
      createdById: '473c9379-e4e9-4284-a03d-8bb87cbd6abf',
      createdByName: 'system',
      description: `Tạo mới payment: ${payment.code}`,
      oldData: '{}',
      newData: JSON.stringify(payment),
    };
    await this.actionLogService.create(actionLogDto);

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.configService.get<string>('VNP_TMNCODE'),
      vnp_Amount: Number(payment.amount) * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: booking.id,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: this.configService.get<string>('VNP_RETURN_URL'),
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss'),
    };

    const signedParams = this.signVnpayParams(vnpParams) as Record<string, any>;
    const paymentUrl =
      this.configService.get<string>('VNP_URL') +
      '?' +
      qs.stringify(signedParams, { encode: false });

    return { paymentUrl };
  }

  async handleVnpayIPN(query: any) {
    const secureHash = query.vnp_SecureHash;
    const inputData = { ...query };
    delete inputData.vnp_SecureHash;
    delete inputData.vnp_SecureHashType;

    const signedParams = this.signVnpayParams(inputData) as Record<string, any>;

    if (
      String(secureHash || '').toLowerCase() !==
      String(signedParams.vnp_SecureHash || '').toLowerCase()
    ) {
      return { RspCode: '97', Message: 'Invalid checksum' };
    }

    const payment = await this.paymentRepo.findOne({
      where: { code: query.vnp_TxnRef },
      order: { createdAt: 'DESC' },
    });

    if (!payment) {
      return { RspCode: '01', Message: 'Payment not found' };
    }

    if (payment.status === enumData.PAYMENT_STATUS.SUCCESS.code) {
      return { RspCode: '02', Message: 'Already confirmed' };
    }

    const booking = await this.bookingRepo.findOne({
      where: { id: payment.bookingId },
    });

    if (!booking) {
      return { RspCode: '01', Message: 'Booking not found' };
    }

    const isSuccess = query.vnp_ResponseCode === '00';

    payment.transactionId = query.vnp_TransactionNo;
    payment.bankCode = query.vnp_BankCode;
    payment.responseCode = query.vnp_ResponseCode;
    payment.responseMessage = query.vnp_Message;

    if (isSuccess) {
      payment.status = enumData.PAYMENT_STATUS.SUCCESS.code;
      payment.paidAt = new Date();

      booking.status = enumData.BOOKING_STATUS.CONFIRMED.code;
      booking.confirmedAt = new Date();
    } else {
      payment.status = enumData.PAYMENT_STATUS.FAILED.code;
      booking.status = enumData.BOOKING_STATUS.CANCELLED.code;
    }

    await this.paymentRepo.save(payment);
    await this.bookingRepo.save(booking);

    return { RspCode: '00', Message: 'Confirm Success' };
  }

  handleVnpayReturn(query: any) {
    return {
      success: query.vnp_ResponseCode === '00',
      paymentCode: query.vnp_TxnRef,
      bookingId: query.vnp_OrderInfo,
    };
  }

  private signVnpayParams(params: any) {
    const sortedEncoded: Record<string, string> = {};

    Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null)
      .sort()
      .forEach((key) => {
        sortedEncoded[key] = encodeURIComponent(String(params[key])).replace(
          /%20/g,
          '+',
        );
      });

    const signData = qs.stringify(sortedEncoded, { encode: false });
    const hmac = crypto.createHmac(
      'sha512',
      this.configService.get<string>('VNP_HASH_SECRET') || '',
    );
    const secureHash = hmac.update(signData, 'utf-8').digest('hex');

    return {
      ...sortedEncoded,
      vnp_SecureHashType: 'SHA512',
      vnp_SecureHash: secureHash,
    };
  }
}
