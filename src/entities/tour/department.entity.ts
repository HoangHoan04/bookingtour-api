import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BranchEntity } from './branch.entity';
import { CompanyEntity } from './company.entity';
import { DepartmentTypeEntity } from './department-type.entity';
import { EmployeeEntity } from './employee.entity';
import { PartEntity } from './part.entity';
import { PositionEntity } from './position.entity';

/** Phòng ban */
@Entity('department')
@Tree('closure-table')
export class DepartmentEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã phòng ban' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên phòng ban' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty({ description: 'Mô tả phòng ban' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Giới hạn nhân viên' })
  @Column({ type: 'integer', nullable: true })
  limit?: number;

  @ApiProperty({ description: 'Id công ty' })
  @Column({ type: 'uuid', nullable: true })
  companyId?: string;
  @ManyToOne(() => CompanyEntity, (p) => p.departments)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: Promise<CompanyEntity>;

  @ApiProperty({ description: 'Chi nhánh' })
  @Column({ type: 'uuid', nullable: true })
  branchId?: string;
  @ManyToOne(() => BranchEntity, (p) => p.departments)
  @JoinColumn({ name: 'branchId', referencedColumnName: 'id' })
  branch: Promise<BranchEntity>;

  @ApiProperty({ description: 'ID hạng loại phòng ban' })
  @Column({ type: 'uuid', nullable: true })
  departmentTypeId?: string;
  @ManyToOne(() => DepartmentTypeEntity, (dt) => dt.departments)
  @JoinColumn({ name: 'departmentTypeId' })
  departmentType: Promise<DepartmentTypeEntity>;

  @ApiProperty({ description: 'Phòng ban cha' })
  @TreeParent()
  parentDepartment: Promise<DepartmentEntity>;

  @ApiProperty({ description: 'Phòng ban con' })
  @TreeChildren()
  childDepartments: Promise<DepartmentEntity[]>;

  @ApiProperty({ description: 'Nhân viên' })
  @OneToMany(() => EmployeeEntity, (p) => p.department)
  employees: Promise<EmployeeEntity[]>;

  @ApiProperty({ description: 'Bộ phận' })
  @OneToMany(() => PartEntity, (p) => p.department)
  parts: Promise<PartEntity[]>;

  @ApiProperty({ description: 'Vị trí' })
  @OneToMany(() => PositionEntity, (p) => p.department)
  positions: Promise<PositionEntity[]>;
}
