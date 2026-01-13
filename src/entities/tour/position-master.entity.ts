import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CareerPathEntity } from './career-path.entity';
import { EmployeeEntity } from './employee.entity';
import { PartMasterPositionMasterEntity } from './part-position-master.entity';
import { PositionEntity } from './position.entity';

/** Vị trí master */
@Entity('position_master')
export class PositionMasterEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã vị trí' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên vị trí' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty({ description: 'Mô tả vị trí - Ghi chú' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Có giới hạn giờ công ?' })
  @Column({ nullable: true, default: false })
  isLimitHoursWorking?: boolean;

  @ApiProperty({ description: 'Giới hạn theo enum PositionLimit' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  limit?: string;

  @ApiProperty({ description: 'giờ công' })
  @Column({ type: 'int', nullable: true })
  workingHour?: number;

  @ApiProperty({ description: 'Có chấm công hay không ?' })
  @Column({ nullable: true, default: false })
  isTimeKeeping?: boolean;

  @ApiProperty({ description: 'Giờ bắt đầu làm việc' })
  @Column({ type: 'time', nullable: true })
  hourWorkingStart?: string;

  @ApiProperty({ description: 'Giờ kết thúc làm việc' })
  @Column({ type: 'time', nullable: true })
  hourWorkingEnd?: string;

  @ApiProperty({ description: 'Giờ bắt đầu nghỉ trưa' })
  @Column({ type: 'time', nullable: true })
  hourSnapShotStart?: string;

  @ApiProperty({ description: 'Giờ kết thúc nghỉ trưa' })
  @Column({ type: 'time', nullable: true })
  hourSnapShotEnd?: string;

  @ApiProperty({ description: 'Giờ làm việc tối thiểu' })
  @Column({ type: 'int', nullable: true })
  minimumWorkingHour?: number;

  @ApiProperty({ description: 'Có đổi vị trí hay không ?' })
  @Column({ nullable: true, default: false })
  isSwapPosition?: boolean;

  @ApiProperty({ description: 'Danh sách Mã vị trí đổi (Lưu dạng string)' })
  @Column({ type: 'text', nullable: true })
  targetChangePositionId?: string;

  @ApiProperty({ description: 'Có yêu cầu duyệt khi tuyển dụng ?' })
  @Column({ nullable: true, default: true })
  isApprovedWhenHiringCandidate?: boolean;

  @ApiProperty({ description: 'Có phỏng vấn lần 2 ?' })
  @Column({ nullable: true, default: false })
  isHadASecondInterview?: boolean;

  @ApiProperty({
    description: 'Có quyền duyệt ngày nghỉ (Trưởng nhóm, Trưởng bộ phận) ?',
  })
  @Column({ nullable: true, default: false })
  isApprovedDayOff?: boolean;

  @ApiProperty({ description: 'Mối liên hệ với danh sách vị trí' })
  @OneToMany(() => PositionEntity, (p) => p.positionMaster)
  positions: Promise<PositionEntity[]>;

  @ApiProperty({ description: 'Danh sách nhân viên' })
  @OneToMany(() => EmployeeEntity, (p) => p.positionMaster)
  employees: Promise<EmployeeEntity[]>;

  @ApiProperty({ description: 'Danh sách liên kết với bộ phận master' })
  @OneToMany(() => PartMasterPositionMasterEntity, (pmp) => pmp.positionMaster)
  partMasterPositions: Promise<PartMasterPositionMasterEntity[]>;

  @ApiProperty({ description: 'Các vị trí có thể lên tiếp' })
  @OneToMany(() => CareerPathEntity, (cp) => cp.currentPosition)
  nextCareers: Promise<CareerPathEntity[]>;

  @ApiProperty({ description: 'Các vị trí tiền nhiệm' })
  @OneToMany(() => CareerPathEntity, (cp) => cp.nextPosition)
  previousCareers: Promise<CareerPathEntity[]>;
}
