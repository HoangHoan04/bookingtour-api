import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file_archival.entity';

@Entity('banners')
export class BannerEntity extends BaseEntity {
  @ApiProperty({ description: 'Link đích khi click vào banner' })
  @Column({ type: 'varchar', nullable: true })
  url?: string;

  @ApiProperty({ description: 'Tiêu đề banner' })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty({ description: 'Thứ tự hiển thị banner' })
  @Column({ type: 'int', nullable: true, default: 0 })
  displayOrder: number;

  @ApiProperty({ description: 'Trạng thái hiển thị banner' })
  @Column({ type: 'boolean', nullable: false, default: true })
  isVisible: boolean;

  @ApiProperty({ description: 'Ngày bắt đầu hiệu lực của banner' })
  @Column({ type: 'timestamptz', nullable: true })
  effectiveStartDate?: Date;

  @ApiProperty({ description: 'Ngày kết thúc hiệu lực của banner' })
  @Column({ type: 'timestamptz', nullable: true })
  effectiveEndDate?: Date;

  @ApiProperty({ description: 'Trạng thái banner' })
  @Column({ type: 'varchar', nullable: true })
  status: string;

  @ApiProperty({ description: 'Loại banner' })
  @Column({ type: 'varchar', nullable: true, length: 40 })
  type?: string;

  @OneToOne(() => FileArchivalEntity, (file) => file.banner)
  image: FileArchivalEntity;
}
