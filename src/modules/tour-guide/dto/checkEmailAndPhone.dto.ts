import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CheckPhoneEmailTourGuideDto {
  @ApiProperty({ description: 'Số điện thoại hướng dẫn viên' })
  phone?: string;

  @ApiProperty({ description: 'Email hướng dẫn viên' })
  email?: string;
}

export class SendOtpTourGuideDto {
  @ApiProperty({ description: 'Phương thức gửi otp' })
  @IsString()
  @IsNotEmpty()
  sendMethod: string;

  @ApiProperty({ description: 'Số điện thoại hướng dẫn viên' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email hướng dẫn viên' })
  @IsString()
  email?: string;
}

export class ForgotPasswordTourGuideDto {
  @ApiProperty({ description: 'Phương thức gửi otp' })
  @IsString()
  @IsNotEmpty()
  sendMethod: string;

  @ApiProperty({ description: 'Id hướng dẫn viên' })
  @IsString()
  @IsNotEmpty()
  tourGuideId: string;

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

  @ApiProperty({ description: 'Số điện thoại hướng dẫn viên' })
  phone: string;

  @ApiProperty({ description: 'Email hướng dẫn viên' })
  email?: string;

  @ApiProperty({ description: 'Mã xác thực OTP' })
  @IsString()
  @IsNotEmpty()
  otpCode: string;
}

export class ChangePasswordTourGuideDto {
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
