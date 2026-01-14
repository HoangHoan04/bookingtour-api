import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TourDetailEntity } from './tour_details.entity';

@Entity('tour_itineraries')
export class TourItinerarieEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã chi tiết tour' })
  @Column({ type: 'uuid', nullable: false })
  tourDetailId: string;
  @OneToOne(() => TourDetailEntity, (tourDetail) => tourDetail.tourItinerarie)
  @JoinColumn({ name: 'tourDetailId' })
  tourDetail: TourDetailEntity;

  @ApiProperty({ description: 'Mã lịch trình tour' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @ApiProperty({ description: 'Tiêu đề lịch trình' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiProperty({ description: 'Ngày thứ mấy trong hành trình tour' })
  @Column({ type: 'int', nullable: false })
  dayNumber: number;

  @ApiProperty({ description: 'Nội dung chi tiết lịch trình' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ description: 'Các hoạt động trong lịch trình' })
  @Column({ type: 'text' })
  activities: string;

  @ApiProperty({ description: 'Các bữa ăn trong lịch trình' })
  @Column({ type: 'text' })
  meals: string;

  @ApiProperty({ description: 'Mô tả ngắn gọn' })
  @Column({ type: 'varchar', length: 255 })
  accommodation: string;
}
