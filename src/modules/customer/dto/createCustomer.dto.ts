import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileDto } from 'src/dto';
export class CreateCustomerDto {
  @ApiProperty({ description: 'Họ và tên khách hàng' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Giới tính khách hàng' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'Email khách hàng' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Địa chỉ' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Ngày sinh' })
  @IsNotEmpty()
  birthday: Date;

  @ApiProperty({ description: 'Quốc tịch' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ description: 'Số căn cước công dân/CMND' })
  @IsOptional()
  @IsString()
  identityCard?: string;

  @ApiProperty({ description: 'Số hộ chiếu' })
  @IsOptional()
  @IsString()
  passportNumber?: string;

  @ApiProperty({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL avatar của khách hàng' })
  @IsOptional()
  avatar?: FileDto[];
}

export class RegisterCustomerDto {
  @ApiProperty({ description: 'Tên khách hàng' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Giới tính', example: 'Nam' })
  @IsString()
  @MaxLength(10)
  gender: string;

  @ApiProperty({ description: 'Email khách hàng' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Mã xác thực tài khoản' })
  @IsString()
  otpCode: string;

  @ApiProperty({ description: 'Phương thức gửi otp' })
  @IsString()
  @IsNotEmpty()
  sendMethod: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Nhập lại mật khẩu' })
  @IsString()
  confirmPassword: string;
}
