import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { EmployeeEntity } from './employee.entity';
import { ShiftMasterEntity } from './shift-master.entity';

/** Ca làm việc */
@Entity('shift')
export class ShiftEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã ca làm việc' })
  @Column()
  code: string;

  @ApiProperty({ description: 'Tên ca làm việc' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Mô tả ca làm việc' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Ngày bắt đầu áp dụng' })
  @Column({ type: 'timestamptz', nullable: true })
  startDate?: Date;

  @ApiProperty({ description: 'Ngày kết thúc áp dụng' })
  @Column({ type: 'timestamptz', nullable: true })
  endDate?: Date;

  @ApiProperty({ description: 'Ca làm việc thuộc ca làm việc mẫu' })
  @Column({ type: 'uuid' })
  shiftMasterId: string;
  @ManyToOne(() => ShiftMasterEntity, (sm) => sm.shifts)
  @JoinColumn({ name: 'shiftMasterId' })
  shiftMaster: Promise<ShiftMasterEntity>;

  @ApiProperty({ description: 'Danh sách nhân viên' })
  @OneToMany(() => EmployeeEntity, (e) => e.shift)
  employees: Promise<EmployeeEntity[]>;
}
