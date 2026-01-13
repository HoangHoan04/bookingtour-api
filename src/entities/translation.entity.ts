import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('translations')
export class TranslationEntity extends BaseEntity {
  @ApiProperty({ description: 'Key để định danh bản dịch' })
  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @ApiProperty({ description: 'Ngôn ngữ tiếng Anh' })
  @Column({ type: 'text', nullable: true })
  en: string;

  @ApiProperty({ description: 'Ngôn ngữ tiếng Việt' })
  @Column({ type: 'text', nullable: true })
  vi: string;
}
