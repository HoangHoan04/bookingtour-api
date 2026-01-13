import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CompanyEntity } from './company.entity';
import { ShiftEntity } from './shift.entity';

/** Ca làm việc mẫu */
@Entity('shift_master')
export class ShiftMasterEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã ca làm việc ' })
  @Column()
  code: string;

  @ApiProperty({ description: 'Tên ca làm việc' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Thời gian bắt đầu' })
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({ description: 'Thời gian kết thúc' })
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({ description: 'Mô tả ca làm việc' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Công ty' })
  @Column({ type: 'uuid', nullable: false })
  companyId: string;
  @ManyToOne(() => CompanyEntity, (c) => c.shiftMasters)
  @JoinColumn({ name: 'companyId' })
  company: Promise<CompanyEntity>;

  @ApiProperty({ description: 'Danh sách ca làm việc' })
  @OneToMany(() => ShiftEntity, (s) => s.shiftMaster)
  shifts: Promise<ShiftEntity[]>;
}
