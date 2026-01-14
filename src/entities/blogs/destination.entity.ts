import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('destinations')
export class DestinationEntity extends BaseEntity {
  @ApiProperty({ description: 'Mâ điểm đến' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên điểm đến' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ApiProperty({ description: 'URL slug' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  slug: string;

  @ApiProperty({ description: 'Quốc gia' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @ApiProperty({ description: 'Vùng/miền' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string;

  @ApiProperty({ description: 'Mô tả điểm đến' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Ảnh đại diện' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'Vĩ độ' })
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @ApiProperty({ description: 'Kinh độ' })
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @ApiProperty({ description: 'Thời gian tốt nhất' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bestTimeToVisit: string;

  @ApiProperty({ description: 'Nhiệt độ trung bình' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  averageTemperature: string;

  @ApiProperty({ description: 'Hoạt động phổ biến' })
  @Column({ type: 'json', nullable: true })
  popularActivities: string[];

  @ApiProperty({ description: 'Số tour đến điểm này' })
  @Column({ type: 'int', default: 0 })
  touringCount: number;

  @ApiProperty({ description: 'Số lượt xem' })
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @ApiProperty({ description: 'Đánh giá trung bình' })
  @Column({ type: 'int', nullable: true })
  rating: number;

  @ApiProperty({ description: 'Trạng thái ACTIVE/INACTIVE' })
  @Column({ type: 'varchar', length: 50 })
  status: string;
}
