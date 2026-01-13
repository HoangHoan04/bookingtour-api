import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { FileDto } from 'src/dto';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Mã nhân viên', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Họ nhân viên', maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  lastName: string;

  @ApiProperty({ description: 'Tên nhân viên', maxLength: 250 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  firstName: string;

  @ApiProperty({ description: 'Họ và tên đầy đủ', maxLength: 250 })
  @IsString()
  @IsOptional()
  @MaxLength(250)
  fullName?: string;

  @ApiProperty({ description: 'Số điện thoại', maxLength: 25 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  phone: string;

  @ApiProperty({ description: 'Số điện thoại phụ', maxLength: 25 })
  @IsString()
  @IsOptional()
  @MaxLength(25)
  secondaryPhone?: string;

  @ApiProperty({ description: 'Email cá nhân', maxLength: 250 })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(250)
  email: string;

  @ApiProperty({ description: 'Giới tính (MALE, FEMALE)', maxLength: 10 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  gender: string;

  @ApiProperty({ description: 'Ngày sinh' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({
    description: 'Quốc tịch',
    maxLength: 50,
    default: 'Việt Nam',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nationality?: string;

  @ApiProperty({ description: 'Dân tộc', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  ethnicity?: string;

  @ApiProperty({ description: 'Tôn giáo', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  religion?: string;

  @ApiProperty({
    description: 'Tình trạng hôn nhân (SINGLE, MARRIED, DIVORCED, WIDOWED)',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  maritalStatus?: string;

  @ApiProperty({
    description: 'Số người phụ thuộc',
    default: 0,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  numberOfDependents?: number;

  @ApiProperty({ description: 'Số căn cước công dân/CMND', maxLength: 12 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  identityCard: string;

  @ApiProperty({ description: 'Nơi cấp CCCD/CMND' })
  @IsString()
  @IsNotEmpty()
  placeOfIssuance: string;

  @ApiProperty({ description: 'Ngày cấp CCCD/CMND' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  issuanceDate: Date;

  @ApiProperty({ description: 'Hộ khẩu thường trú' })
  @IsString()
  @IsNotEmpty()
  permanentAddress: string;

  @ApiProperty({ description: 'Địa chỉ hiện tại/tạm trú', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nowAddress: string;

  @ApiProperty({ description: 'Tỉnh/Thành phố hiện tại', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  currentCity: string;

  @ApiProperty({ description: 'Quận/Huyện hiện tại', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  currentDistrict: string;

  @ApiProperty({ description: 'Phường/Xã hiện tại', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  currentWard: string;

  @ApiProperty({ description: 'Số hộ chiếu', maxLength: 20 })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  passportNumber?: string;

  @ApiProperty({ description: 'Ngày cấp hộ chiếu' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  passportIssueDate?: Date;

  @ApiProperty({ description: 'Ngày hết hạn hộ chiếu' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  passportExpiryDate?: Date;

  @ApiProperty({
    description: 'Số bảo hiểm xã hội',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  socialInsuranceNumber?: string;

  @ApiProperty({
    description: 'Số bảo hiểm y tế',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  healthInsuranceNumber?: string;

  @ApiProperty({ description: 'Số tài khoản ngân hàng', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  bankAccountNumber: string;

  @ApiProperty({ description: 'Tên ngân hàng', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  bankName: string;

  @ApiProperty({ description: 'Chi nhánh ngân hàng', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  bankBranch: string;

  @ApiProperty({ description: 'Tên chủ tài khoản', maxLength: 250 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  bankAccountHolder: string;

  @ApiProperty({
    description: 'Mã số thuế cá nhân',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  taxCode?: string;

  @ApiProperty({
    description: 'Email công ty',
    maxLength: 250,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(250)
  companyEmail?: string;

  @ApiProperty({ description: 'ID Công ty' })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({ description: 'ID Chi nhánh' })
  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({ description: 'ID Phòng ban' })
  @IsUUID()
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ description: 'ID Bộ phận' })
  @IsUUID()
  @IsOptional()
  partId?: string;

  @ApiProperty({
    description: 'ID Chức danh (Position Master)',
  })
  @IsUUID()
  @IsOptional()
  positionMasterId?: string;

  @ApiProperty({ description: 'ID Vị trí công việc' })
  @IsUUID()
  @IsOptional()
  positionId?: string;

  @ApiProperty({
    description:
      'Cấp bậc (INTERN, FRESHER, JUNIOR, MIDDLE, SENIOR, LEAD, MANAGER, DIRECTOR)',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  level?: string;

  @ApiProperty({
    description: 'Cách làm việc (FULLTIME, PARTTIME, CONTRACT, FREELANCE)',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  workingMode: string;

  @ApiProperty({
    description: 'Loại hợp đồng (PROBATION, DEFINITE, INDEFINITE, SEASONAL)',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  contractType?: string;

  @ApiProperty({
    description: 'Trạng thái thử việc (PENDING, PASSED, FAILED)',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  probationStatus?: string;

  @ApiProperty({ description: 'Ngày bắt đầu thử việc' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateStartProbation?: Date;

  @ApiProperty({ description: 'Ngày kết thúc thử việc' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateEndProbation?: Date;

  @ApiProperty({
    description: 'Ngày bắt đầu làm việc chính thức',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateStartOfficial?: Date;

  @ApiProperty({ description: 'Ngày tham gia công ty (Ngày nhận việc)' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  joinDate: Date;

  @ApiProperty({ description: 'Ngày ký hợp đồng' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  contractSignDate?: Date;

  @ApiProperty({ description: 'Ngày kết thúc hợp đồng' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  contractEndDate?: Date;

  @ApiProperty({ description: 'Thời gian làm việc (tháng)' })
  @IsInt()
  @IsOptional()
  @Min(0)
  workingDuration?: number;

  @ApiProperty({
    description: 'Người liên hệ khẩn cấp - Tên',
    maxLength: 250,
  })
  @IsString()
  @IsOptional()
  @MaxLength(250)
  emergencyContactName?: string;

  @ApiProperty({
    description: 'Người liên hệ khẩn cấp - Quan hệ',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  emergencyContactRelation?: string;

  @ApiProperty({
    description: 'Người liên hệ khẩn cấp - SĐT',
    maxLength: 25,
  })
  @IsString()
  @IsOptional()
  @MaxLength(25)
  emergencyContactPhone?: string;

  @ApiProperty({
    description: 'Người liên hệ khẩn cấp - Địa chỉ',
  })
  @IsString()
  @IsOptional()
  emergencyContactAddress?: string;

  @ApiProperty({
    description: 'Trạng thái nhân viên',
    maxLength: 36,
  })
  @IsString()
  @IsOptional()
  @MaxLength(36)
  status?: string;

  @ApiProperty({ description: 'Ngày nghỉ việc' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  resignationDate?: Date;

  @ApiProperty({ description: 'Lý do nghỉ việc' })
  @IsString()
  @IsOptional()
  resignationReason?: string;

  @ApiProperty({ description: 'Ghi chú' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Ghi chú nội bộ (chỉ admin xem được)',
  })
  @IsString()
  @IsOptional()
  internalNote?: string;

  @ApiProperty({
    description: 'Có được phép truy cập hệ thống',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  hasSystemAccess?: boolean;

  @ApiProperty({
    description: 'Có được nhận email thông báo',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  receiveNotification?: boolean;

  @ApiProperty({ description: 'ID Quản lý trực tiếp' })
  @IsUUID()
  @IsOptional()
  managerId?: string;

  @ApiProperty({ description: 'ID Ca làm việc' })
  @IsUUID()
  @IsOptional()
  shiftId?: string;

  @ApiProperty({
    description: 'Hình ảnh avatar',
    type: [FileDto],
  })
  @IsOptional()
  avatar?: FileDto[];

  @ApiProperty({
    description: 'Hình ảnh mặt trước CCCD',
    type: [FileDto],
  })
  @IsOptional()
  frontIdCard?: FileDto[];

  @ApiProperty({
    description: 'Hình ảnh mặt sau CCCD',
    type: [FileDto],
  })
  @IsOptional()
  backIdCard?: FileDto[];

  @ApiProperty({
    description: 'Hồ sơ CV (Curriculum Vitae)',
    type: [FileDto],
  })
  @IsOptional()
  cvFiles?: FileDto[];

  @ApiProperty({
    description: 'Hợp đồng lao động (Bản scan đã ký)',
    type: [FileDto],
  })
  @IsOptional()
  contractFiles?: FileDto[];

  @ApiProperty({
    description: 'Danh sách ID các role',
    type: [String],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  roleIds?: string[];
}

export class CreateEmployeeEducationDto {
  @ApiProperty({ description: 'ID nhân viên' })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Trường đào tạo', maxLength: 200 })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  school?: string;

  @ApiProperty({ description: 'Trình độ học vấn', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  educationLevel?: string;

  @ApiProperty({ description: 'Chuyên ngành', maxLength: 150 })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  major?: string;

  @ApiProperty({ description: 'Năm tốt nghiệp' })
  @IsInt()
  @IsOptional()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  graduationYear?: number;

  @ApiProperty({ description: 'Ngoại ngữ', maxLength: 200 })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  languages?: string;

  @ApiProperty({ description: 'Chứng chỉ' })
  @IsString()
  @IsOptional()
  certificates?: string;

  @ApiProperty({ description: 'Kỹ năng' })
  @IsString()
  @IsOptional()
  skills?: string;

  @ApiProperty({ description: 'Năm bắt đầu' })
  @IsInt()
  @IsOptional()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  startYear?: number;

  @ApiProperty({ description: 'Năm kết thúc' })
  @IsInt()
  @IsOptional()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  endYear?: number;

  @ApiProperty({ description: 'Điểm trung bình (GPA)' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(4)
  gpa?: number;

  @ApiProperty({ description: 'Tài liệu đính kèm' })
  @IsOptional()
  documents?: FileDto[];
}

export class CreateEmployeeCertificateDto {
  @ApiProperty({ description: 'ID nhân viên' })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Tên chứng chỉ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mã chứng chỉ' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Ngày cấp' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  issueDate?: Date;

  @ApiProperty({ description: 'Ngày hết hạn' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  expiryDate?: Date;

  @ApiProperty({ description: 'Nơi cấp' })
  @IsString()
  @IsOptional()
  issuingOrganization?: string;

  @ApiProperty({ description: 'Tài liệu đính kèm' })
  @IsOptional()
  documents?: FileDto[];
}
