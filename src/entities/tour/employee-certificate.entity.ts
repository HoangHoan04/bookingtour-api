import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UploadFileEntity } from '../upload_file.entity';
import { EmployeeEntity } from './employee.entity';

/** Chứng chỉ của nhân viên */
@Entity('employee_certificate')
export class EmployeeCertificateEntity extends BaseEntity {
  @ApiProperty({ description: 'ID nhân viên' })
  @Column({ type: 'uuid', nullable: false })
  employeeId: string;
  @ManyToOne(() => EmployeeEntity, (e) => e.certificates)
  @JoinColumn({ name: 'employeeId' })
  employee: Promise<EmployeeEntity>;

  @ApiProperty({ description: 'Mã chứng chỉ' })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ApiProperty({ description: 'Tên chứng chỉ' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Ngày cấp' })
  @Column({ type: 'timestamptz', nullable: true })
  issueDate?: Date;

  @ApiProperty({ description: 'Ngày hết hạn' })
  @Column({ type: 'timestamptz', nullable: true })
  expiryDate?: Date;

  @ApiProperty({ description: 'Nơi cấp' })
  @Column({ nullable: true })
  issuingOrganization?: string;

  @ApiProperty({ description: 'Tài liệu đính kèm (Bản scan chứng chỉ)' })
  @OneToMany(() => UploadFileEntity, (file) => file.employeeCertificate)
  documents: Promise<UploadFileEntity[]>;
}
