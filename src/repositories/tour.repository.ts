import {
  BookingDetailEntity,
  BookingEntity,
  PaymentEntity,
  ReviewEntity,
  ReviewResponseEntity,
  TourDetailEntity,
  TourEntity,
  TourItinerarieEntity,
  TourPriceEntity,
  UserVoucherEntity,
  VoucherEntity,
} from 'src/entities';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(BookingEntity)
export class BookingRepository extends Repository<BookingEntity> {}

@CustomRepository(BookingDetailEntity)
export class BookingDetailRepository extends Repository<BookingDetailEntity> {}

@CustomRepository(PaymentEntity)
export class PaymentRepository extends Repository<PaymentEntity> {}

@CustomRepository(ReviewEntity)
export class ReviewRepository extends Repository<ReviewEntity> {}

@CustomRepository(ReviewResponseEntity)
export class ReviewResponseRepository extends Repository<ReviewResponseEntity> {}

@CustomRepository(TourDetailEntity)
export class TourDetailRepository extends Repository<TourDetailEntity> {}

@CustomRepository(TourItinerarieEntity)
export class TourItinerarieRepository extends Repository<TourItinerarieEntity> {}

@CustomRepository(TourPriceEntity)
export class TourPriceRepository extends Repository<TourPriceEntity> {}

@CustomRepository(TourEntity)
export class TourRepository extends Repository<TourEntity> {}

@CustomRepository(UserVoucherEntity)
export class UserVoucherRepository extends Repository<UserVoucherEntity> {}

@CustomRepository(VoucherEntity)
export class VoucherRepository extends Repository<VoucherEntity> {}
