import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BranchEntity } from './branch.entity';
import { CompanyEntity } from './company.entity';
import { DepartmentEntity } from './department.entity';
import { EmployeeEntity } from './employee.entity';
import { PartMasterEntity } from './part-master.entity';
import { PositionEntity } from './position.entity';

/** Cấu hình bộ phận */
@Entity('part')
export class PartEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã bộ phận' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên bộ phận' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty({ description: 'Mô tả bộ phận - Ghi chú' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Id công ty' })
  @Column({ nullable: true, type: 'uuid' })
  companyId?: string;
  @ManyToOne(() => CompanyEntity, (p) => p.parts)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: Promise<CompanyEntity>;

  @ApiProperty({ description: 'Id branch' })
  @Column({ nullable: true, type: 'uuid' })
  branchId?: string;
  @ManyToOne(() => BranchEntity, (p) => p.parts)
  @JoinColumn({ name: 'branchId', referencedColumnName: 'id' })
  branch: Promise<BranchEntity>;

  @ApiProperty({ description: 'Id phòng ban' })
  @Column({ type: 'uuid', nullable: true })
  departmentId?: string;
  @ManyToOne(() => DepartmentEntity, (p) => p.parts)
  @JoinColumn({ name: 'departmentId', referencedColumnName: 'id' })
  department: Promise<DepartmentEntity>;

  @ApiProperty({ description: 'Id bộ phận master' })
  @Column({ type: 'uuid', nullable: true })
  partMasterId?: string;
  @ManyToOne(() => PartMasterEntity, (p) => p.parts)
  @JoinColumn({ name: 'partMasterId', referencedColumnName: 'id' })
  partMaster: Promise<PartMasterEntity>;

  @ApiProperty({ description: 'Nhân viên' })
  @OneToMany(() => EmployeeEntity, (p) => p.part)
  employees: Promise<EmployeeEntity[]>;

  @ApiProperty({ description: 'Chức vụ' })
  @OneToMany(() => PositionEntity, (p) => p.part)
  positions: Promise<PositionEntity[]>;
}
