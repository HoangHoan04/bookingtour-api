import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @ApiOperation({ summary: 'Gửi email xác thực đăng ký tài khoản' })
  @Post('send-verify-email')
  public async sendVerify(@Body() data: { email: string; otpCode: string }) {
    return await this.service.sendEmailVerify(data);
  }
}
