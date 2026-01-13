import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BranchEntity } from './branch.entity';
import { DepartmentEntity } from './department.entity';
import { EmployeeEntity } from './employee.entity';
import { PositionEntity } from './position.entity';
import { TransferEmployeePositionEntity } from './transfer-employee-position.entity';
import { TransferEmployeeEntity } from './transfer-employee.entity';

/** Chi tiết điều chuyển nhân viên */
@Entity('transfer_employee_detail')
export class TransferEmployeeDetailEntity extends BaseEntity {
  @ApiProperty({ description: 'ID điều chuyển nhân viên' })
  @Column({ type: 'uuid' })
  transferEmployeeId: string;
  @ManyToOne(() => TransferEmployeeEntity, (t) => t.details)
  @JoinColumn({ name: 'transferEmployeeId' })
  transferEmployee: Promise<TransferEmployeeEntity>;

  @ApiProperty({ description: 'ID nhân viên' })
  @Column({ type: 'uuid' })
  employeeId: string;
  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employeeId' })
  employee: Promise<EmployeeEntity>;

  @ApiProperty({ description: 'ID công ty cũ' })
  @Column({ type: 'uuid', nullable: true })
  oldCompanyId?: string;

  @ApiProperty({ description: 'ID chi nhánh cũ' })
  @Column({ type: 'uuid', nullable: true })
  oldBranchId?: string;
  @ManyToOne(() => BranchEntity)
  @JoinColumn({ name: 'oldBranchId' })
  oldBranch: Promise<BranchEntity>;

  @ApiProperty({ description: 'ID phòng ban cũ' })
  @Column({ type: 'uuid', nullable: true })
  oldDepartmentId?: string;
  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'oldDepartmentId' })
  oldDepartment: Promise<DepartmentEntity>;

  @ApiProperty({ description: 'ID bộ phận cũ' })
  @Column({ type: 'uuid', nullable: true })
  oldPartId?: string;

  @ApiProperty({ description: 'ID chức vụ cũ' })
  @Column({ type: 'uuid', nullable: true })
  oldPositionId?: string;
  @ManyToOne(() => PositionEntity)
  @JoinColumn({ name: 'oldPositionId' })
  oldPosition: Promise<PositionEntity>;

  @ApiProperty({ description: 'Chi tiết chức vụ mới khi điều chuyển' })
  @OneToOne(() => TransferEmployeePositionEntity, (p) => p.transferDetail)
  newPositionDetail: Promise<TransferEmployeePositionEntity>;
}
