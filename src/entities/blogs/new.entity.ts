import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file_archival.entity';

/** Tin tức */
@Entity('news')
export class NewsEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã tin tức, do người dùng nhập' })
  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @ApiProperty({ description: 'Tiêu đề tin tức ' })
  @Column({
    type: 'varchar',
    comment: 'Tiêu đề tin tức ',
    length: 255,
    nullable: false,
  })
  title: string;

  @ApiProperty({ description: 'Nội dung tin tức ' })
  @Column({
    type: 'text',
    comment: 'Nội dung tin tức ',
  })
  content: string;

  @ApiProperty({ description: 'Loại tin tức' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Loại tin tức',
    default: 'NEWS',
  })
  type: string;

  @ApiProperty({ description: 'Ngày bắt đầu hiệu lực của bài viết' })
  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Ngày bắt đầu hiệu lực của bài viết',
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Ngày kết thúc hiệu lực của bài viết' })
  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Ngày kết thúc hiệu lực của bài viết',
  })
  effectiveEndDate: Date;

  @ApiProperty({ description: 'Trạng thái bài viết' })
  @Column({
    type: 'varchar',
    length: 25,
    nullable: false,
    comment: 'Trạng thái bài viết',
    default: 'FRESHLY_CREATED',
  })
  status: string;

  @ApiProperty({ description: 'Xếp hạng nổi bật bài viết' })
  @Column({
    type: 'int',
    nullable: true,
    comment: 'Xếp hạng nổi bật bài viết',
  })
  rank?: number;

  @ApiProperty({ description: 'Trạng thái hiển thị của tin tức' })
  @Column({
    type: 'boolean',
    nullable: false,
    comment: 'Trạng thái hiển thị của tin tức',
    default: true,
  })
  isVisible: boolean;

  /** Danh sách hình ảnh của tin tức*/
  @OneToMany(() => FileArchivalEntity, (file) => file.new)
  images?: Promise<FileArchivalEntity[]>;
}
