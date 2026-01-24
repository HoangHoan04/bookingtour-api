// email.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailService, SendContactDto } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly service: EmailService) {}

  @ApiOperation({ summary: 'Gửi email xác thực đăng ký tài khoản' })
  @Post('send-verify-email')
  public async sendVerify(@Body() data: { email: string; otpCode: string }) {
    return await this.service.sendEmailVerify(data);
  }

  @ApiOperation({ summary: 'Gửi email quên mật khẩu' })
  @Post('send-forgot-password-email')
  public async sendForgotPassword(
    @Body() data: { email: string; otpCode: string },
  ) {
    return await this.service.sendEmailForgotPassword(data);
  }

  @ApiOperation({ summary: 'Gửi email liên hệ' })
  @Post('send-contact')
  public async sendContact(@Body() data: SendContactDto) {
    await this.service.sendContactToAdmin(data);
    await this.service.sendContactConfirmation(data);

    return {
      success: true,
      message: 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.',
    };
  }
}
