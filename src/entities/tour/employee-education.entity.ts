import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UploadFileEntity } from '../upload_file.entity';
import { EmployeeEntity } from './employee.entity';

/** Trình độ học vấn của nhân viên */
@Entity('employee_education')
export class EmployeeEducationEntity extends BaseEntity {
  @ApiProperty({ description: 'ID nhân viên' })
  @Column({ type: 'uuid', nullable: false })
  employeeId: string;
  @ManyToOne(() => EmployeeEntity, (e) => e.educations)
  @JoinColumn({ name: 'employeeId' })
  employee: Promise<EmployeeEntity>;

  @ApiProperty({ description: 'Trường đào tạo' })
  @Column({ type: 'varchar', length: 200, nullable: true })
  school?: string;

  @ApiProperty({ description: 'Trình độ học vấn' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  educationLevel?: string;

  @ApiProperty({ description: 'Chuyên ngành' })
  @Column({ type: 'varchar', length: 150, nullable: true })
  major?: string;

  @ApiProperty({ description: 'Năm tốt nghiệp' })
  @Column({ type: 'int', nullable: true })
  graduationYear?: number;

  @ApiProperty({ description: 'Ngoại ngữ' })
  @Column({ type: 'varchar', length: 200, nullable: true })
  languages?: string;

  @ApiProperty({ description: 'Chứng chỉ' })
  @Column({ type: 'text', nullable: true })
  certificates?: string;

  @ApiProperty({ description: 'Kỹ năng' })
  @Column({ type: 'text', nullable: true })
  skills?: string;

  @ApiProperty({ description: 'Năm bắt đầu' })
  @Column({ type: 'int', nullable: true })
  startYear?: number;

  @ApiProperty({ description: 'Năm kết thúc' })
  @Column({ type: 'int', nullable: true })
  endYear?: number;

  @ApiProperty({ description: 'Điểm trung bình (GPA)' })
  @Column({ type: 'float', nullable: true })
  gpa?: number;

  @ApiProperty({
    description: 'Tài liệu đính kèm (Bản scan Bằng cấp, Bảng điểm)',
  })
  @OneToMany(() => UploadFileEntity, (file) => file.employeeEducation)
  documents: Promise<UploadFileEntity[]>;
}
