import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileDto } from 'src/dto';
export class CreateTourGuideDto {
  @ApiProperty({ description: 'Họ và tên hướng dẫn viên' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Số điện thoại hướng dẫn viên' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Email hướng dẫn viên' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Địa chỉ hướng dẫn viên' })
  @IsString()
  @IsOptional()
  @MaxLength(250)
  address?: string;

  @ApiProperty({ description: 'Giới tính' })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  gender?: string;

  @ApiProperty({ description: 'Ngày sinh hướng dẫn viên' })
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({ description: 'Quốc tịch hướng dẫn viên' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nationality?: string;

  @ApiProperty({ description: 'Số căn cước công dân/CMND' })
  @IsString()
  @IsOptional()
  @MaxLength(12)
  identityCard?: string;

  @ApiProperty({ description: 'Số hộ chiếu' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  passportNumber?: string;

  @ApiProperty({ description: 'Tiểu sử ngắn' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  shortBio?: string;

  @ApiProperty({ description: 'Tiểu sử đầy đủ' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Ngôn ngữ hướng dẫn' })
  @IsOptional()
  languages?: string[];

  @ApiProperty({
    description: 'Chuyên môn/Lĩnh vực (VD: Lịch sử, Văn hóa, Ẩm thực)',
  })
  @IsOptional()
  specialties?: string[];

  @ApiProperty({ description: 'Số năm kinh nghiệm' })
  @IsOptional()
  yearsOfExperience?: number;

  @ApiProperty({ description: 'Số chứng chỉ hướng dẫn viên' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  licenseNumber?: string;

  @ApiProperty({ description: 'Ngày cấp chứng chỉ' })
  @IsOptional()
  licenseIssuedDate?: Date;

  @ApiProperty({ description: 'Ngày hết hạn chứng chỉ' })
  @IsOptional()
  licenseExpiryDate?: Date;

  @ApiProperty({ description: 'Người cấp chứng chỉ' })
  @IsOptional()
  licenseIssuedBy?: string;

  @ApiProperty({ description: 'Đánh giá trung bình  ' })
  @IsOptional()
  averageRating?: number;

  @ApiProperty({ description: 'Tổng số đánh giá' })
  @IsOptional()
  totalReviews?: number;

  @ApiProperty({ description: 'Tổng số tour đã dẫn' })
  @IsOptional()
  totalToursCompleted?: number;

  @ApiProperty({ description: 'Mô tả thêm' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Lương cơ bản' })
  @IsOptional()
  baseSalary?: number;

  @ApiProperty({ description: 'Phần trăm hoa hồng' })
  @IsOptional()
  commissionRate?: number;

  @ApiProperty({ description: 'Ngày bắt đầu làm việc' })
  startDate?: Date;

  @ApiProperty({ description: 'Ngày kết thúc làm việc' })
  endDate?: Date;

  @ApiProperty({ description: 'Trạng thái sẵn sàng nhận tour' })
  isAvailable: boolean;

  @ApiProperty({ description: 'Số tài khoản ngân hàng' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  bankAccountNumber?: string;

  @ApiProperty({ description: 'Tên ngân hàng' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  bankName?: string;

  @ApiProperty({ description: 'Chủ tài khoản' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  bankAccountName?: string;

  @ApiProperty({
    description: 'URL avatar của hướng dẫn viên',
    required: false,
  })
  @IsOptional()
  avatar?: FileDto[];
}
