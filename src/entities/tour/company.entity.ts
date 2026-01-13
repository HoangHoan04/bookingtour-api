import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UploadFileEntity } from '../upload_file.entity';
import { BranchEntity } from './branch.entity';
import { DepartmentEntity } from './department.entity';
import { EmployeeEntity } from './employee.entity';
import { PartEntity } from './part.entity';
import { PositionEntity } from './position.entity';
import { ShiftMasterEntity } from './shift-master.entity';

/** Công ty */
@Entity('company')
export class CompanyEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã công ty' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên công ty' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty({ description: 'Mô tả công ty' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Địa chỉ công ty' })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty({ description: 'Mã số thuế' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  taxCode?: string;

  @ApiProperty({ description: 'Số điện thoại công ty' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string;

  @ApiProperty({ description: 'Email công ty' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @ApiProperty({ description: 'Website công ty' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @ApiProperty({ description: 'Ngày thành lập' })
  @Column({ type: 'timestamptz', nullable: true })
  foundedDate?: Date;

  @ApiProperty({ description: 'Người đại diện pháp luật' })
  @Column({ type: 'varchar', length: 250, nullable: true })
  legalRepresentative?: string;

  @ApiProperty({ description: 'Công ty cha' })
  @Column({ type: 'uuid', nullable: true })
  parentCompanyId?: string;
  @ManyToOne(() => CompanyEntity, (company) => company.childCompanies)
  @JoinColumn({ name: 'parentCompanyId' })
  parentCompany: Promise<CompanyEntity>;

  @OneToMany(() => CompanyEntity, (company) => company.parentCompany)
  childCompanies: Promise<CompanyEntity[]>;

  @ApiProperty({ description: 'Nhân viên' })
  @OneToMany(() => EmployeeEntity, (p) => p.company)
  employees: Promise<EmployeeEntity[]>;

  @ApiProperty({ description: 'Vị trí' })
  @OneToMany(() => PositionEntity, (p) => p.company)
  positions: Promise<PositionEntity[]>;

  @ApiProperty({ description: 'Phòng ban' })
  @OneToMany(() => DepartmentEntity, (p) => p.company)
  departments: Promise<DepartmentEntity[]>;

  @ApiProperty({ description: 'Chi nhánh' })
  @OneToMany(() => BranchEntity, (p) => p.company)
  branches: Promise<BranchEntity[]>;

  @ApiProperty({ description: 'Bộ phận' })
  @OneToMany(() => PartEntity, (p) => p.company)
  parts: Promise<PartEntity[]>;

  @ApiProperty({ description: 'Ca làm việc' })
  @OneToMany(() => ShiftMasterEntity, (p) => p.company)
  shiftMasters: Promise<ShiftMasterEntity[]>;

  @ApiProperty({ description: 'Tài liệu công ty (GPKD, Hồ sơ thuế...)' })
  @OneToMany(() => UploadFileEntity, (file) => file.documentCompany)
  documents: Promise<UploadFileEntity[]>;

  @ApiProperty({ description: 'Logo công ty' })
  @OneToMany(() => UploadFileEntity, (file) => file.logoCompany)
  logoUrl: Promise<UploadFileEntity[]>;
}
