import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BookingEntity } from './booking.entity';
import { TourDetailEntity } from './tour_details.entity';
import { TourPriceEntity } from './tour_price.entity';

@Entity('booking_details')
export class BookingDetailEntity extends BaseEntity {
  @ApiProperty({ description: 'Giá snapshot tại thời điểm đặt' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  price: number;

  @ApiProperty({ description: 'Mã đơn đặt' })
  @Column({ type: 'uuid', nullable: false })
  bookingId: string;

  @ManyToOne(() => BookingEntity, (booking) => booking.bookingDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @ApiProperty({ description: 'Mã tour đã đặt' })
  @Column({ type: 'uuid', nullable: false })
  tourId: string;

  @ApiProperty({ description: 'Số lượng người đặt' })
  @Column({ type: 'int', nullable: false })
  quantity: number;

  @ApiProperty({ description: 'Thành tiền (price * quantity)' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  subtotal: number;

  @ApiProperty({ description: 'Trạng thái chi tiết' })
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @ApiProperty({ description: 'Mã chi tiết tour' })
  @Column({ type: 'uuid', nullable: false })
  tourDetailId: string;
  @ManyToOne(() => TourDetailEntity, (tourDetail) => tourDetail.bookingDetails)
  @JoinColumn({ name: 'tourDetailId' })
  tourDetail: TourDetailEntity;

  @ApiProperty({ description: 'Mã chi tiết giá tour' })
  @Column({ type: 'uuid', nullable: true })
  tourPriceId: string;
  @ManyToOne(() => TourPriceEntity, (tourPrice) => tourPrice.bookingDetails)
  @JoinColumn({ name: 'tourPriceId' })
  tourPrice: TourPriceEntity;
}
