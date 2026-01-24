import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { ReviewEntity } from './review.entity';
import { TourDestinationEntity } from './tour_destination.entity';
import { TourDetailEntity } from './tour_details.entity';

@Entity('tours')
export class TourEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã tour' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code?: string;

  @ApiProperty({ description: 'Tiêu đề tour' })
  @Column({ type: 'varchar', length: 100, unique: true })
  title: string;

  @ApiProperty({ description: 'URL-friendly của tour' })
  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @ApiProperty({ description: 'Địa điểm tổ chức' })
  @Column({ type: 'varchar', length: 255 })
  location: string;

  @ApiProperty({ description: 'Số ngày diễn ra tour' })
  @Column({ type: 'varchar', length: 50 })
  durations: string;

  @ApiProperty({ description: 'Mô tả ngắn gọn' })
  @Column({ type: 'text', nullable: false })
  shortDescription: string;

  @ApiProperty({ description: 'Mô tả chi tiết' })
  @Column({ type: 'text', nullable: true })
  longDescription?: string;

  @ApiProperty({ description: 'Điểm nổi bật của tour' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  highlights?: string;

  @ApiProperty({ description: 'Những gì đã bao gồm trong tour' })
  @Column({ type: 'text', nullable: true })
  included?: string;

  @ApiProperty({ description: 'Những gì chưa bao gồm trong tour' })
  @Column({ type: 'text', nullable: true })
  excluded?: string;

  @ApiProperty({ description: 'Đánh giá trung bình của tour' })
  @Column({ type: 'float', default: 0 })
  rating: number;

  @ApiProperty({ description: 'Tổng số đánh giá của tour' })
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @ApiProperty({ description: 'Số lần xem trang tour' })
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @ApiProperty({ description: 'Số lần đặt tour' })
  @Column({ type: 'int', default: 0 })
  bookingCount: number;

  @ApiProperty({ description: 'Danh mục tour' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  @ApiProperty({ description: 'Tags tìm kiếm' })
  @Column({ type: 'text', nullable: true })
  tags?: string[];

  @ApiProperty({ description: 'Trạng thái tour' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @ApiProperty({ description: 'Các điểm đến của tour' })
  @OneToMany(() => TourDestinationEntity, (td) => td.tour)
  tourDestinations: Promise<TourDestinationEntity[]>;

  @ApiProperty({ description: 'Chi tiết tour' })
  @OneToMany(() => TourDetailEntity, (tourDetails) => tourDetails.tour)
  tourDetails: Promise<TourDetailEntity[]>;

  @ApiProperty({ description: 'Review của khách hàng' })
  @OneToMany(() => ReviewEntity, (p) => p.booking)
  reviews: Promise<ReviewEntity[]>;
}
