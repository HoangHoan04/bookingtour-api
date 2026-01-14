import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BookingDetailEntity } from './booking_detail.entity';
import { TourDetailEntity } from './tour_details.entity';

@Entity('tour_prices')
export class TourPriceEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã giá tour' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @ApiProperty({ description: 'Loại giá tour' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  priceType: string;

  @ApiProperty({ description: 'Giá tour' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  price: number;

  @ApiProperty({ description: 'Đơn vị tiền tệ', default: 'VND' })
  @Column({ type: 'varchar', length: 255 })
  currency: string;

  @ApiProperty({ description: 'Chi tiết đặt chỗ' })
  @OneToMany(() => BookingDetailEntity, (bd) => bd.tourPrice)
  bookingDetails: Promise<BookingDetailEntity[]>;

  @ApiProperty({ description: 'Mã chi tiết tour' })
  @Column({ type: 'uuid', nullable: true })
  tourDetailId?: string;
  @OneToOne(() => TourDetailEntity, (td) => td.tourPrice)
  @JoinColumn({ name: 'tourDetailId' })
  tourDetail?: TourDetailEntity;
}
