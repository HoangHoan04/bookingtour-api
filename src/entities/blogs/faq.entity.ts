import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('faqs')
export class FaqEntity extends BaseEntity {
  @ApiProperty({ description: 'Câu hỏi' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  question: string;

  @ApiProperty({ description: 'Câu trả lời' })
  @Column({ type: 'text', nullable: false })
  answer: string;

  @ApiProperty({ description: 'Danh mục FAQ' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Column({ type: 'int', nullable: true })
  displayOrder: number;

  @ApiProperty({ description: 'Số lượt xem' })
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @ApiProperty({ description: 'Số người thấy hữu ích' })
  @Column({ type: 'int', default: 0 })
  isHelpful: number;

  @ApiProperty({ description: 'Tags để tìm kiếm' })
  @Column({ type: 'json', nullable: true })
  tags: string[];

  @ApiProperty({ description: 'Trạng thái FAQ' })
  @Column({ type: 'varchar', length: 50 })
  status: string;
}
