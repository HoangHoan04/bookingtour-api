import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file_archival.entity';

@Entity('travel_hint')
export class TravelHintEntity extends BaseEntity {
  @ApiProperty({ description: 'Tháng gợi ý (1–12)' })
  @Column({ type: 'int', nullable: false })
  month: number;

  @ApiProperty({ description: 'Tên địa điểm du lịch' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  locationName: string;

  @ApiProperty({ description: 'Mô tả ngắn gọn' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Lý do nên đi vào tháng này' })
  @Column({ type: 'text', nullable: true })
  reason: string;

  @ApiProperty({ description: 'Loại du lịch' })
  @Column({ type: 'varchar', length: 36, nullable: false })
  type: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @ApiProperty({ description: 'Quốc gia (nếu nước ngoài)' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  country: string;

  @ApiProperty({ description: 'Thành phố / tỉnh' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  city: string;

  @ApiProperty({ description: 'Vĩ độ (latitude)' })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @ApiProperty({ description: 'Kinh độ (longitude)' })
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @ApiProperty({ description: 'Ảnh về địa điểm gợi ý' })
  @OneToMany(() => FileArchivalEntity, (p) => p.travelHint)
  images: Promise<FileArchivalEntity[]>;
}
