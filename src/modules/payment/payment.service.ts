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
import { GenerateCodeHelper } from 'src/helpers/generateCodeHelper';
import { CodeType } from 'src/helpers/generateCode.config';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { BookingRepository, PaymentRepository } from 'src/repositories';
import { IdDto } from 'src/dto';

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
    const txnRef = `${booking.id}$${Date.now()}`;

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
      vnp_TmnCode: process.env.VNP_TMNCODE,
      vnp_Amount: Number(payment.amount) * 100,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txnRef,
      vnp_OrderInfo: payment.code,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss'),
    };

    const signedParams = this.signVnpayParams(vnpParams) as Record<string, any>;
    signedParams.vnp_SecureHashType = 'SHA512';

    const paymentUrl =
      this.configService.get('VNP_URL') + '?' + qs.stringify(signedParams);

    return { paymentUrl };
  }

  async handleVnpayIPN(query: any) {
    const secureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;
    delete query.vnp_SecureHashType;

    const signedParams = this.signVnpayParams(query, true) as Record<
      string,
      any
    >;

    if (secureHash !== signedParams.vnp_SecureHash) {
      return { RspCode: '97', Message: 'Invalid checksum' };
    }

    const bookingId = query.vnp_TxnRef.split('$')[0];

    const payment = await this.paymentRepo.findOne({
      where: { bookingId },
      order: { createdAt: 'DESC' },
    });

    if (!payment) {
      return { RspCode: '01', Message: 'Payment not found' };
    }

    if (payment.status === enumData.PAYMENT_STATUS.SUCCESS.code) {
      return { RspCode: '02', Message: 'Already confirmed' };
    }

    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
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

  async handleVnpayReturn(query: any) {
    return {
      success: query.vnp_ResponseCode === '00',
      bookingId: query.vnp_TxnRef?.split('$')[0],
    };
  }

  private signVnpayParams(params: any, includeHash = true) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    const signData = qs.stringify(sortedParams, { encode: true });
    const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET || '');
    const secureHash = hmac.update(signData).digest('hex');

    if (includeHash) {
      sortedParams['vnp_SecureHash'] = secureHash;
    }

    return sortedParams;
  }
}
