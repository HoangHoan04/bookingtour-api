import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BranchEntity } from './branch.entity';
import { DepartmentEntity } from './department.entity';
import { PositionEntity } from './position.entity';
import { TransferEmployeeDetailEntity } from './transfer-employee-detail.entity';

/** Chi tiết chức vụ mới khi điều chuyển nhân viên */
@Entity('transfer_employee_position')
export class TransferEmployeePositionEntity extends BaseEntity {
  @ApiProperty({ description: 'ID chi tiết điều chuyển nhân viên' })
  @Column({ type: 'uuid', unique: true })
  transferEmployeeDetailId: string;
  @OneToOne(() => TransferEmployeeDetailEntity, (d) => d.newPositionDetail)
  @JoinColumn({ name: 'transferEmployeeDetailId' })
  transferDetail: Promise<TransferEmployeeDetailEntity>;

  @ApiProperty({ description: 'ID công ty mới' })
  @Column({ type: 'uuid', nullable: true })
  newCompanyId?: string;

  @ApiProperty({ description: 'ID chi nhánh mới' })
  @Column({ type: 'uuid', nullable: true })
  newBranchId?: string;
  @ManyToOne(() => BranchEntity)
  @JoinColumn({ name: 'newBranchId' })
  newBranch: Promise<BranchEntity>;

  @ApiProperty({ description: 'ID phòng ban mới' })
  @Column({ type: 'uuid', nullable: true })
  newDepartmentId?: string;
  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'newDepartmentId' })
  newDepartment: Promise<DepartmentEntity>;

  @ApiProperty({ description: 'ID bộ phận mới' })
  @Column({ type: 'uuid', nullable: true })
  newPartId?: string;

  @ApiProperty({ description: 'ID chức vụ mới' })
  @Column({ type: 'uuid', nullable: true })
  newPositionId?: string;
  @ManyToOne(() => PositionEntity)
  @JoinColumn({ name: 'newPositionId' })
  newPosition: Promise<PositionEntity>;

  @ApiProperty({ description: 'Mức lương mới' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  newSalary?: number;

  @ApiProperty({ description: 'Ghi chú' })
  @Column({ type: 'text', nullable: true })
  note?: string;
}
