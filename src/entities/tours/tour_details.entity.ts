import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BookingDetailEntity } from './booking_detail.entity';
import { TourEntity } from './tour.entity';
import { TourItinerarieEntity } from './tour_itinerarie.entity';
import { TourPriceEntity } from './tour_price.entity';

@Entity('tour_details')
export class TourDetailEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã tour' })
  @Column({ type: 'uuid', nullable: true })
  tourId?: string;
  @ManyToOne(() => TourEntity, (tour) => tour.tourDetails)
  @JoinColumn({ name: 'tourId' })
  tour?: TourEntity;

  @ApiProperty({ description: 'Mã tour' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @ApiProperty({ description: 'Ngày bắt đầu tour' })
  @Column({ type: 'timestamp', nullable: false })
  startDay: Date;

  @ApiProperty({ description: 'Ngày kết thúc tour' })
  @Column({ type: 'timestamp', nullable: false })
  endDay: Date;

  @ApiProperty({ description: 'Địa điểm bắt đầu tour' })
  @Column({ type: 'varchar', length: 255 })
  startLocation: string;

  @ApiProperty({ description: 'Sức chứa tối đa' })
  @Column({ type: 'int' })
  capacity: number;

  @ApiProperty({ description: 'Số chỗ còn lại' })
  @Column({ type: 'int' })
  remainingSeats: number;

  @ApiProperty({ description: 'Trạng thái tour' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @ApiProperty({ description: 'Chi tiết giá tour' })
  @OneToMany(() => TourPriceEntity, (tourPrice) => tourPrice.tourDetail)
  tourPrice: Promise<TourPriceEntity[]>;

  @ApiProperty({ description: 'Lịch trình tour' })
  @OneToMany(() => TourItinerarieEntity, (ti) => ti.tourDetail)
  tourItinerarie: Promise<TourItinerarieEntity[]>;

  @ApiProperty({ description: 'Chi tiết đặt chỗ' })
  @OneToMany(() => BookingDetailEntity, (bd) => bd.tourDetail)
  bookingDetails: Promise<BookingDetailEntity[]>;
}
