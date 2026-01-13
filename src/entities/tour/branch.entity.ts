import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BranchPartMasterEntity } from './branch-part-master.entity';
import { CompanyEntity } from './company.entity';
import { DepartmentEntity } from './department.entity';
import { EmployeeEntity } from './employee.entity';
import { PartEntity } from './part.entity';
import { PositionEntity } from './position.entity';

/** Chi nhánh của công ty */
@Entity('branch')
export class BranchEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã chi nhánh' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên chi nhánh' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty({ description: 'Loại chi nhánh' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  type?: string;

  @ApiProperty({ description: 'Có phải trụ sở chính không?' })
  @Column({ type: 'boolean', default: true })
  isHeadquarters?: boolean;

  @ApiProperty({ description: 'Mô tả chi nhánh' })
  @Column({ type: 'varchar', length: '255', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Địa chỉ chi nhánh' })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty({ description: 'Địa chỉ IP' })
  @Column({ type: 'varchar', length: 30, nullable: true })
  ipAddress?: string;

  @ApiProperty({ description: 'Số điện thoại chi nhánh' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'Email chi nhánh' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @ApiProperty({ description: 'Tên ngắn chi nhánh' })
  @Column({ type: 'varchar', length: 250, nullable: true })
  shortName?: string;

  @ApiProperty({ description: 'Id công ty' })
  @Column({ type: 'uuid', nullable: true })
  companyId?: string;
  @ManyToOne(() => CompanyEntity, (p) => p.branches)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: Promise<CompanyEntity>;

  @ApiProperty({ description: 'Danh sách phòng ban' })
  @OneToMany(() => DepartmentEntity, (p) => p.branch)
  departments: Promise<DepartmentEntity[]>;

  @ApiProperty({ description: 'Bộ phận' })
  @OneToMany(() => PartEntity, (p) => p.branch)
  parts: Promise<PartEntity[]>;

  @ApiProperty({ description: 'Danh sách vị trí' })
  @OneToMany(() => PositionEntity, (p) => p.branch)
  positions: Promise<PositionEntity[]>;

  @ApiProperty({ description: 'Nhân viên' })
  @OneToMany(() => EmployeeEntity, (p) => p.branch)
  employees: Promise<EmployeeEntity[]>;

  @ApiProperty({ description: 'Danh sách bộ phận master của chi nhánh' })
  @OneToMany(() => BranchPartMasterEntity, (bpm) => bpm.branch)
  branchPartMasters: Promise<BranchPartMasterEntity[]>;
}
