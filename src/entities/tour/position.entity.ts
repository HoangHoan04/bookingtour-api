import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BranchEntity } from './branch.entity';
import { CompanyEntity } from './company.entity';
import { DepartmentEntity } from './department.entity';
import { EmployeeEntity } from './employee.entity';
import { PartEntity } from './part.entity';
import { PositionMasterEntity } from './position-master.entity';

/** Vị trí nhân viên*/
@Entity('position')
export class PositionEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã vị trí' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên vị trí' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty({ description: 'Mô tả vị trí - Ghi chú' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Nội dung' })
  @Column({ type: 'text', nullable: true })
  content?: string;

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

  @ApiProperty({ description: 'Công ty' })
  @Column({ type: 'uuid', nullable: true })
  companyId?: string;
  @ManyToOne(() => CompanyEntity, (p) => p.positions)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: Promise<CompanyEntity>;

  @ApiProperty({ description: 'Chi nhánh' })
  @Column({ type: 'uuid', nullable: true })
  branchId?: string;
  @ManyToOne(() => BranchEntity, (p) => p.positions)
  @JoinColumn({ name: 'branchId', referencedColumnName: 'id' })
  branch: Promise<BranchEntity>;

  @ApiProperty({ description: 'Phòng ban' })
  @Column({ type: 'uuid', nullable: true })
  departmentId?: string;
  @ManyToOne(() => DepartmentEntity, (p) => p.positions)
  @JoinColumn({ name: 'departmentId', referencedColumnName: 'id' })
  department: Promise<DepartmentEntity>;

  @ApiProperty({ description: 'Bộ phận' })
  @Column({ type: 'uuid', nullable: true })
  partId?: string;
  @ManyToOne(() => PartEntity, (p) => p.positions)
  @JoinColumn({ name: 'partId', referencedColumnName: 'id' })
  part: Promise<PartEntity>;

  @ApiProperty({ description: 'Khoá ngoại liên kết với bản Postion Master' })
  @Column({ type: 'uuid', nullable: true })
  positionMasterId?: string;
  @ManyToOne(() => PositionMasterEntity, (p) => p.positions)
  @JoinColumn({ name: 'positionMasterId', referencedColumnName: 'id' })
  positionMaster: Promise<PositionMasterEntity>;

  @ApiProperty({ description: 'Danh sách nhân viên' })
  @OneToMany(() => EmployeeEntity, (p) => p.position)
  employees: Promise<EmployeeEntity[]>;
}
