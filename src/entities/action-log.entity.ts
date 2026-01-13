import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('action_log')
export class ActionLogEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã người tạo hành động' })
  @Column({ type: 'uuid', nullable: true })
  createdById: string;

  @ApiProperty({ description: 'Tên người tạo hành động' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  createdByName: string;

  @ApiProperty({ description: 'Ghi chú của người tạo hành động' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  createdNote: string;

  @ApiProperty({ description: 'Mô tả hành động' })
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty({ description: 'Dữ liệu cũ' })
  @Column({ type: 'text', nullable: true })
  dataOld: string;

  @ApiProperty({ description: 'Dữ liệu mới' })
  @Column({ type: 'text', nullable: true })
  dataNew: string;

  @ApiProperty({ description: 'Loại hành động' })
  @Column({ type: 'varchar', nullable: false })
  type: string;

  @ApiProperty({ description: 'Loại chức năng' })
  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  functionType: string;

  @ApiProperty({ description: 'Mã chức năng' })
  @Column({ type: 'uuid', nullable: true })
  functionId?: string;
}
