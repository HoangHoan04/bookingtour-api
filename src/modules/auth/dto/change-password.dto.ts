import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Mật khẩu hiện tại' })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Mật khẩu mới' })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({ description: 'Xác nhận mật khẩu mới' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
