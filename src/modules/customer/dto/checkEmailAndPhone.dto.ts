import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CheckPhoneEmailCustomerDto {
  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  phone: string;

  @ApiProperty({ description: 'Email khách hàng' })
  email?: string;
}

export class SendOtpCustomerDto {
  @ApiProperty({ description: 'Phương thức gửi otp' })
  @IsString()
  @IsNotEmpty()
  sendMethod: string;

  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email khách hàng' })
  @IsString()
  email?: string;
}

export class ForgotPasswordCustomerDto {
  @ApiProperty({ description: 'Phương thức gửi otp' })
  @IsString()
  @IsNotEmpty()
  sendMethod: string;

  @ApiProperty({ description: 'Id khách hàng' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Mã otp' })
  @IsString()
  @IsNotEmpty()
  otpCode?: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'Nhập lại mật khẩu' })
  @IsOptional()
  @IsString()
  confirmPassword?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ description: 'Phương thức gửi otp' })
  @IsString()
  @IsNotEmpty()
  sendMethod: string;

  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  phone: string;

  @ApiProperty({ description: 'Email khách hàng' })
  email?: string;

  @ApiProperty({ description: 'Mã xác thực OTP' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}

export class ChangePasswordCustomerDto {
  @ApiProperty({ description: 'Mật khẩu mới' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  newPassword: string;

  @ApiProperty({ description: 'Xác nhận mật khẩu mới' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  confirmPassword: string;
}
