import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscribeNewsletterDto {
  @ApiProperty({
    description: 'Email đăng ký nhận tin',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail({})
  email: string;
}

export class UnsubscribeNewsletterDto {
  @ApiProperty({
    description: 'Email hủy đăng ký',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail({})
  email: string;
}
