import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { BookingDetailEntity, BookingEntity } from 'src/entities';
import { CodeType } from 'src/helpers/generateCode.config';
import { GenerateCodeHelper } from 'src/helpers/generateCodeHelper';
import {
  BookingDetailRepository,
  BookingRepository,
  TourDetailRepository,
  TourPriceRepository,
  TourRepository,
} from 'src/repositories';
import { FindOptionsWhere, ILike } from 'typeorm';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { PaymentService } from '../payment/payment.service';
import { CreateBookingDto, UpdateBookingDto } from './dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly repo: BookingRepository,
    private readonly actionLogService: ActionLogService,
    private readonly bookingDetailRepo: BookingDetailRepository,
    private readonly tourRepository: TourRepository,
    private readonly tourPriceRepository: TourPriceRepository,
    private readonly tourDetailRepository: TourDetailRepository,
    private readonly paymentService: PaymentService,
  ) {}

  async findOne(id: string) {
    const booking = await this.repo.findOne({
      where: { id },
      relations: {
        customer: true,
        bookingDetails: true,
        reviews: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy đơn đặt tour');
    }

    return booking;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<BookingEntity> = {};

    if (data.where.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }

    if (data.where.status) {
      whereCon.status = data.where.status;
    }

    if (data.where.customerId) {
      whereCon.customerId = data.where.customerId;
    }

    const [bookings, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: bookings,
      total,
    };
  }

  async create(dto: CreateBookingDto, user: UserDto) {
    // check remainingSeats
    if (dto.bookingDetails && dto.bookingDetails.length > 0) {
      const totalSeatsNeeded = dto.bookingDetails.reduce(
        (sum, detail) => sum + detail.quantity,
        0,
      );
      const detailCkeck = dto.bookingDetails[0];
      const tour = await this.tourRepository.findOne({
        where: { id: detailCkeck.tourId },
      });
      if (!tour) {
        throw new NotFoundException(
          `Tour với id ${detailCkeck.tourId} không tồn tại`,
        );
      }
      const tourDetail = await this.tourDetailRepository.findOne({
        where: { id: detailCkeck.tourDetailId },
      });

      if (!tourDetail) {
        throw new NotFoundException(
          `Chi tiết tour với id ${detailCkeck.tourDetailId} không tồn tại`,
        );
      }

      if (tourDetail.remainingSeats < totalSeatsNeeded) {
        throw new BadRequestException(
          `Số chỗ còn lại của chi tiết tour với id ${detailCkeck.tourDetailId} không đủ`,
        );
      }
    }

    const booking = new BookingEntity();

    booking.code = await GenerateCodeHelper.generate(
      CodeType.BOOKING,
      this.repo,
    );
    booking.contactFullname = dto.contactFullname;
    booking.contactEmail = dto.contactEmail;
    booking.contactPhone = dto.contactPhone;
    booking.contactAddress = dto.contactAddress;
    booking.note = dto.note ?? '';

    booking.status = enumData.BOOKING_STATUS.PENDING.code;
    booking.expiredAt = dayjs().add(10, 'minute').toDate();

    booking.customerId = user.customerId || user.id;
    booking.createdBy = user.id;
    booking.createdAt = new Date();

    booking.totalPrice = dto.totalPrice;
    booking.discountAmount = dto.discountAmount || 0;
    booking.finalPrice =
      dto.finalPrice !== undefined
        ? dto.finalPrice
        : booking.totalPrice - booking.discountAmount;
    booking.voucherCode = dto.voucherCode || '';

    const bookingSaved = await this.repo.insert(booking);

    if (dto.bookingDetails && dto.bookingDetails.length > 0) {
      for (const detail of dto.bookingDetails) {
        const existingTour = await this.tourRepository.findOne({
          where: { id: detail.tourId },
        });

        if (!existingTour) {
          throw new NotFoundException(
            `Tour với id ${detail.tourId} không tồn tại`,
          );
        }

        const existingTourDetail = await this.tourDetailRepository.findOne({
          where: { id: detail.tourDetailId },
        });

        if (!existingTourDetail) {
          throw new NotFoundException(
            `Chi tiết tour với id ${detail.tourDetailId} không tồn tại`,
          );
        }

        const existingTourPrice = await this.tourPriceRepository.findOne({
          where: { id: detail.tourPriceId },
        });

        if (!existingTourPrice) {
          throw new NotFoundException(
            `Giá tour với id ${detail.tourPriceId} không tồn tại`,
          );
        }

        if (existingTourPrice.tourDetailId !== existingTourDetail.id) {
          throw new BadRequestException(
            `Giá tour với id ${detail.tourPriceId} không thuộc chi tiết tour với id ${detail.tourDetailId}`,
          );
        }

        const bookingDetail = new BookingDetailEntity();
        bookingDetail.bookingId = bookingSaved.identifiers[0].id;
        bookingDetail.tourId = detail.tourId;
        bookingDetail.tourDetailId = detail.tourDetailId;
        bookingDetail.tourPriceId = detail.tourPriceId;
        bookingDetail.price = detail.price;
        bookingDetail.quantity = detail.quantity;
        bookingDetail.subtotal = (detail.price || 0) * (detail.quantity || 0);
        bookingDetail.status = enumData.BOOKING_DETAIL_STATUS.ACTIVE.code;
        bookingDetail.createdBy = user.id;
        bookingDetail.createdAt = new Date();
        await this.bookingDetailRepo.insert(bookingDetail);
        existingTourDetail.remainingSeats -= detail.quantity;
        await this.tourDetailRepository.save(existingTourDetail);
        existingTour.bookingCount += detail.quantity;
        await this.tourRepository.save(existingTour);
      }
    }

    await this.actionLogService.create({
      functionId: booking.id,
      functionType: 'Booking',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo booking: ${booking.code}`,
      oldData: '{}',
      newData: JSON.stringify(booking),
    });

    return this.paymentService.createVnpayPayment({
      id: bookingSaved.identifiers[0].id,
    });
  }

  async update(dto: UpdateBookingDto, user: UserDto) {
    const booking = await this.repo.findOne({
      where: { id: dto.id },
    });

    if (!booking) {
      throw new NotFoundException('Booking không tồn tại');
    }

    const oldData = { ...booking };

    Object.assign(booking, dto);
    booking.updatedBy = user.id;
    booking.updatedAt = new Date();

    await this.repo.save(booking);

    const actionLogDto: ActionLogCreateDto = {
      functionId: booking.id,
      functionType: 'Booking',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật booking: ${booking.code}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(dto),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật đơn đặt tour thành công',
    };
  }

  async cancel(bookingId: string, reason: string, user: UserDto) {
    const booking = await this.repo.findOne({ where: { id: bookingId } });

    if (!booking) {
      throw new NotFoundException('Booking không tồn tại');
    }

    if (booking.status !== enumData.BOOKING_STATUS.PENDING.code) {
      throw new BadRequestException('Không thể huỷ booking này');
    }

    booking.status = enumData.BOOKING_STATUS.CANCELLED.code;
    booking.cancelReason = reason;
    booking.cancelledBy = user.id;

    await this.repo.save(booking);

    await this.actionLogService.create({
      functionId: booking.id,
      functionType: 'Booking',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Huỷ booking: ${booking.code}`,
      oldData: '{}',
      newData: JSON.stringify({ status: booking.status }),
    });

    return { message: 'Huỷ booking thành công' };
  }
}
