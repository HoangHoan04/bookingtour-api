import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UploadFileEntity } from '../upload_file.entity';
import { UserEntity } from '../user/user.entity';
import { BranchEntity } from './branch.entity';
import { CompanyEntity } from './company.entity';
import { DepartmentEntity } from './department.entity';
import { EmployeeCertificateEntity } from './employee-certificate.entity';
import { EmployeeEducationEntity } from './employee-education.entity';
import { PartEntity } from './part.entity';
import { PositionMasterEntity } from './position-master.entity';
import { PositionEntity } from './position.entity';
import { ShiftEntity } from './shift.entity';

/** Nhân viên */
@Entity('employee')
export class EmployeeEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã nhân viên' })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ApiProperty({ description: 'Họ nhân viên' })
  @Column({ type: 'varchar', length: 30, nullable: false })
  lastName: string;

  @ApiProperty({ description: 'Tên nhân viên' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  firstName: string;

  @ApiProperty({ description: 'Họ và tên đầy đủ' })
  @Column({ type: 'varchar', length: 250, nullable: true })
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @Column({ type: 'varchar', length: 25, nullable: false })
  phone: string;

  @ApiProperty({ description: 'Số điện thoại phụ' })
  @Column({ type: 'varchar', length: 25, nullable: true })
  secondaryPhone?: string;

  @ApiProperty({ description: 'Email cá nhân' })
  @Column({ type: 'varchar', length: 250, nullable: false, unique: true })
  email: string;

  @ApiProperty({ description: 'Giới tính (MALE, FEMALE)' })
  @Column({ type: 'varchar', length: 10, nullable: false })
  gender: string;

  @ApiProperty({ description: 'Ngày sinh' })
  @Column({ type: 'timestamptz', nullable: false })
  birthday: Date;

  @ApiProperty({ description: 'Quốc tịch' })
  @Column({ type: 'varchar', length: 50, nullable: true, default: 'Việt Nam' })
  nationality?: string;

  @ApiProperty({ description: 'Dân tộc' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ethnicity?: string;

  @ApiProperty({ description: 'Tôn giáo' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  religion?: string;

  @ApiProperty({
    description: 'Tình trạng hôn nhân (SINGLE, MARRIED, DIVORCED, WIDOWED)',
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  maritalStatus?: string;

  @ApiProperty({ description: 'Số người phụ thuộc' })
  @Column({ type: 'int', nullable: true, default: 0 })
  numberOfDependents?: number;

  @ApiProperty({ description: 'Số căn cước công dân/CMND' })
  @Column({ type: 'varchar', length: 12, nullable: false, unique: true })
  identityCard: string;

  @ApiProperty({ description: 'Nơi cấp CCCD/CMND' })
  @Column({ nullable: false, type: 'text' })
  placeOfIssuance: string;

  @ApiProperty({ description: 'Ngày cấp CCCD/CMND' })
  @Column({ nullable: false, type: 'timestamptz' })
  issuanceDate: Date;

  @ApiProperty({ description: 'Hộ khẩu thường trú' })
  @Column({ type: 'text', nullable: false })
  permanentAddress: string;

  @ApiProperty({ description: 'Địa chỉ hiện tại/tạm trú' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  nowAddress: string;

  @ApiProperty({ description: 'Tỉnh/Thành phố hiện tại' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  currentCity: string;

  @ApiProperty({ description: 'Quận/Huyện hiện tại' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  currentDistrict: string;

  @ApiProperty({ description: 'Phường/Xã hiện tại' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  currentWard: string;

  @ApiProperty({ description: 'Số hộ chiếu' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  passportNumber?: string;

  @ApiProperty({ description: 'Ngày cấp hộ chiếu' })
  @Column({ type: 'timestamptz', nullable: true })
  passportIssueDate?: Date;

  @ApiProperty({ description: 'Ngày hết hạn hộ chiếu' })
  @Column({ type: 'timestamptz', nullable: true })
  passportExpiryDate?: Date;

  @ApiProperty({ description: 'Số bảo hiểm xã hội' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  socialInsuranceNumber?: string;

  @ApiProperty({ description: 'Số bảo hiểm y tế' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  healthInsuranceNumber?: string;

  @ApiProperty({ description: 'Số tài khoản ngân hàng' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  bankAccountNumber: string;

  @ApiProperty({ description: 'Tên ngân hàng' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  bankName: string;

  @ApiProperty({ description: 'Chi nhánh ngân hàng' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  bankBranch: string;

  @ApiProperty({ description: 'Tên chủ tài khoản' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  bankAccountHolder: string;

  @ApiProperty({ description: 'Mã số thuế cá nhân' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  taxCode?: string;

  @ApiProperty({ description: 'Email công ty' })
  @Column({ type: 'varchar', length: 250, nullable: true })
  companyEmail?: string;

  @ApiProperty({ description: 'Công ty' })
  @Column({ type: 'uuid', nullable: false })
  companyId: string;
  @ManyToOne(() => CompanyEntity, (p) => p.employees)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: Promise<CompanyEntity>;

  @ApiProperty({ description: 'Chi nhánh' })
  @Column({ type: 'uuid', nullable: false })
  branchId: string;
  @ManyToOne(() => BranchEntity, (p) => p.employees)
  @JoinColumn({ name: 'branchId', referencedColumnName: 'id' })
  branch: Promise<BranchEntity>;

  @ApiProperty({ description: 'Phòng ban' })
  @Column({ type: 'uuid', nullable: false })
  departmentId: string;
  @ManyToOne(() => DepartmentEntity, (p) => p.employees)
  @JoinColumn({ name: 'departmentId', referencedColumnName: 'id' })
  department: Promise<DepartmentEntity>;

  @ApiProperty({ description: 'Bộ phận' })
  @Column({ type: 'uuid', nullable: true })
  partId?: string;
  @ManyToOne(() => PartEntity, (p) => p.employees)
  @JoinColumn({ name: 'partId', referencedColumnName: 'id' })
  part: Promise<PartEntity>;

  @ApiProperty({ description: 'Chức danh (Position Master)' })
  @Column({ type: 'uuid', nullable: true })
  positionMasterId?: string;
  @ManyToOne(() => PositionMasterEntity, (p) => p.employees)
  @JoinColumn({ name: 'positionMasterId', referencedColumnName: 'id' })
  positionMaster: Promise<PositionMasterEntity>;

  @ApiProperty({ description: 'Vị trí công việc' })
  @Column({ type: 'uuid', nullable: true })
  positionId?: string;
  @ManyToOne(() => PositionEntity, (p) => p.employees)
  @JoinColumn({ name: 'positionId', referencedColumnName: 'id' })
  position: Promise<PositionEntity>;

  @ApiProperty({
    description:
      'Cấp bậc (INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEAD, MANAGER, DIRECTOR)',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  level?: string;

  @ApiProperty({
    description: 'Cách làm việc (FULLTIME, PARTTIME, CONTRACT, FREELANCE)',
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  workingMode: string;

  @ApiProperty({
    description: 'Loại hợp đồng (PROBATION, DEFINITE, INDEFINITE, SEASONAL)',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  contractType?: string;

  @ApiProperty({ description: 'Trạng thái thử việc (PENDING, PASSED, FAILED)' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  probationStatus?: string;

  @ApiProperty({ description: 'Ngày bắt đầu thử việc' })
  @Column({ type: 'timestamptz', nullable: true })
  dateStartProbation?: Date;

  @ApiProperty({ description: 'Ngày kết thúc thử việc' })
  @Column({ type: 'timestamptz', nullable: true })
  dateEndProbation?: Date;

  @ApiProperty({ description: 'Ngày bắt đầu làm việc chính thức' })
  @Column({ type: 'timestamptz', nullable: true })
  dateStartOfficial?: Date;

  @ApiProperty({ description: 'Ngày tham gia công ty (Ngày nhận việc)' })
  @Column({ type: 'timestamptz', nullable: false })
  joinDate: Date;

  @ApiProperty({ description: 'Ngày ký hợp đồng' })
  @Column({ type: 'timestamptz', nullable: true })
  contractSignDate?: Date;

  @ApiProperty({ description: 'Ngày kết thúc hợp đồng' })
  @Column({ type: 'timestamptz', nullable: true })
  contractEndDate?: Date;

  @ApiProperty({ description: 'Thời gian làm việc (tháng)' })
  @Column({ type: 'int', nullable: true })
  workingDuration?: number;

  @ApiProperty({ description: 'Người liên hệ khẩn cấp - Tên' })
  @Column({ type: 'varchar', length: 250, nullable: true })
  emergencyContactName?: string;

  @ApiProperty({ description: 'Người liên hệ khẩn cấp - Quan hệ' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContactRelation?: string;

  @ApiProperty({ description: 'Người liên hệ khẩn cấp - SĐT' })
  @Column({ type: 'varchar', length: 25, nullable: true })
  emergencyContactPhone?: string;

  @ApiProperty({ description: 'Người liên hệ khẩn cấp - Địa chỉ' })
  @Column({ type: 'text', nullable: true })
  emergencyContactAddress?: string;

  @ApiProperty({ description: 'Trạng thái nhân viên' })
  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  status?: string;

  @ApiProperty({ description: 'Ngày nghỉ việc' })
  @Column({ type: 'timestamptz', nullable: true })
  resignationDate?: Date;

  @ApiProperty({ description: 'Lý do nghỉ việc' })
  @Column({ type: 'text', nullable: true })
  resignationReason?: string;

  @ApiProperty({ description: 'Ghi chú' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Ghi chú nội bộ (chỉ admin xem được)' })
  @Column({ type: 'text', nullable: true })
  internalNote?: string;

  @ApiProperty({ description: 'Có được phép truy cập hệ thống' })
  @Column({ nullable: true, default: true })
  hasSystemAccess?: boolean;

  @ApiProperty({ description: 'Có được nhận email thông báo' })
  @Column({ nullable: true, default: true })
  receiveNotification?: boolean;

  @ApiProperty({ description: 'Quản lý trực tiếp' })
  @Column({ type: 'uuid', nullable: true })
  managerId?: string;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.directReports)
  @JoinColumn({ name: 'managerId', referencedColumnName: 'id' })
  manager: Promise<EmployeeEntity>;

  @OneToMany(() => EmployeeEntity, (employee) => employee.manager)
  directReports: Promise<EmployeeEntity[]>;

  @ApiProperty({ description: 'Ảnh đại diện' })
  @OneToMany(() => UploadFileEntity, (p) => p.avatarEmployee)
  avatar: Promise<UploadFileEntity[]>;

  @ApiProperty({ description: 'Ảnh căn cước công dân (Mặt trước)' })
  @OneToMany(() => UploadFileEntity, (p) => p.frontIdCardEmployee)
  frontIdCard: Promise<UploadFileEntity[]>;

  @ApiProperty({ description: 'Ảnh căn cước công dân (Mặt sau)' })
  @OneToMany(() => UploadFileEntity, (p) => p.backIdCardEmployee)
  backIdCard: Promise<UploadFileEntity[]>;

  @ApiProperty({ description: 'Tài khoản người dùng' })
  @OneToOne(() => UserEntity, (user) => user.employee)
  user: Promise<UserEntity>;

  @ApiProperty({ description: 'Ca làm việc' })
  @Column({ type: 'uuid', nullable: true })
  shiftId?: string;
  @ManyToOne(() => ShiftEntity, (s) => s.employees)
  @JoinColumn({ name: 'shiftId' })
  shift: Promise<ShiftEntity>;

  @OneToMany(() => EmployeeEducationEntity, (e) => e.employee)
  educations: Promise<EmployeeEducationEntity[]>;

  @OneToMany(() => EmployeeCertificateEntity, (e) => e.employee)
  certificates: Promise<EmployeeCertificateEntity[]>;

  @ApiProperty({ description: 'Hồ sơ CV (Curriculum Vitae)' })
  @OneToMany(() => UploadFileEntity, (file) => file.cvEmployee)
  cvFiles: Promise<UploadFileEntity[]>;

  @ApiProperty({ description: 'Hợp đồng lao động (Bản scan đã ký)' })
  @OneToMany(() => UploadFileEntity, (file) => file.contractEmployee)
  contractFiles: Promise<UploadFileEntity[]>;
}
