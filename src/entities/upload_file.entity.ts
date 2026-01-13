import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import {
  CompanyEntity,
  EmployeeCertificateEntity,
  EmployeeEducationEntity,
  EmployeeEntity,
  TransferEmployeeEntity,
} from './tour';

@Entity('upload_files')
export class UploadFileEntity extends BaseEntity {
  @ApiProperty({ description: 'Đường dẫn tệp' })
  @Column({ type: 'text', nullable: false, comment: 'Đường dẫn tệp' })
  fileUrl: string;

  @ApiProperty({ description: 'Tên tệp' })
  @Column({ type: 'text', nullable: false, comment: 'Tên tệp' })
  fileName: string;

  @ApiProperty({ description: 'Loại tệp' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  fileType: string;

  @ApiProperty({ description: 'Kích thước tệp (byte)' })
  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @ApiProperty({ description: 'Mô tả tệp' })
  @Column({ type: 'text', nullable: true, comment: 'Mô tả tệp' })
  description: string;

  // Avatar nhân viên
  @Column({ type: 'uuid', nullable: true })
  avatarEmployeeId: string;
  @ManyToOne(() => EmployeeEntity, (p) => p.avatar)
  @JoinColumn({ name: 'avatarEmployeeId' })
  avatarEmployee: Promise<EmployeeEntity>;

  // Chứng minh nhân dân - mặt trước
  @Column({ type: 'uuid', nullable: true })
  frontIdCardEmployeeId: string;
  @ManyToOne(() => EmployeeEntity, (p) => p.frontIdCard)
  @JoinColumn({ name: 'frontIdCardEmployeeId' })
  frontIdCardEmployee: Promise<EmployeeEntity>;

  // Chứng minh nhân dân - mặt sau
  @Column({ type: 'uuid', nullable: true })
  backIdCardEmployeeId: string;
  @ManyToOne(() => EmployeeEntity, (p) => p.backIdCard)
  @JoinColumn({ name: 'backIdCardEmployeeId' })
  backIdCardEmployee: Promise<EmployeeEntity>;

  // CV nhân viên
  @Column({ type: 'uuid', nullable: true })
  cvEmployeeId: string;
  @ManyToOne(() => EmployeeEntity, (p) => p.cvFiles)
  @JoinColumn({ name: 'cvEmployeeId' })
  cvEmployee: Promise<EmployeeEntity>;

  // Hợp đồng nhân viên
  @Column({ type: 'uuid', nullable: true })
  contractEmployeeId: string;
  @ManyToOne(() => EmployeeEntity, (p) => p.contractFiles)
  @JoinColumn({ name: 'contractEmployeeId' })
  contractEmployee: Promise<EmployeeEntity>;

  /** Id logo công ty */
  @Column({ type: 'uuid', nullable: true })
  logoCompanyId: string;
  @ManyToOne(() => CompanyEntity, (p) => p.logoUrl)
  @JoinColumn({ name: 'logoCompanyId', referencedColumnName: 'id' })
  logoCompany: Promise<CompanyEntity>;

  /** Id tài liệu công ty */
  @Column({ type: 'uuid', nullable: true })
  documentCompanyId: string;
  @ManyToOne(() => CompanyEntity, (p) => p.documents)
  @JoinColumn({ name: 'documentCompanyId', referencedColumnName: 'id' })
  documentCompany: Promise<CompanyEntity>;

  /** Id chứng chỉ nhân viên */
  @Column({ type: 'uuid', nullable: true })
  employeeCertificateId: string;
  @ManyToOne(() => EmployeeCertificateEntity, (p) => p.documents)
  @JoinColumn({ name: 'employeeCertificateId' })
  employeeCertificate: Promise<EmployeeCertificateEntity>;

  /** Id trình độ học vấn nhân viên */
  @Column({ type: 'uuid', nullable: true })
  employeeEducationId: string;
  @ManyToOne(() => EmployeeEducationEntity, (p) => p.documents)
  @JoinColumn({ name: 'employeeEducationId' })
  employeeEducation: Promise<EmployeeEducationEntity>;

  /** Id chuyển nhân viên */
  @Column({ type: 'uuid', nullable: true })
  transferEmployeeId: string;
  @ManyToOne(() => TransferEmployeeEntity, (p) => p.documents)
  @JoinColumn({ name: 'transferEmployeeId' })
  transferEmployee: Promise<TransferEmployeeEntity>;
}
