import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZaloService } from './zalo.service';

@ApiTags('User - Zalo')
@Controller('zalo')
export class ZaloController {
  constructor(private service: ZaloService) {}

  @ApiOperation({ summary: 'Gửi zalo otp' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @Post('send-otp')
  async sendOtpCode(
    @Body() data: { phone: string; otpCode: string },
  ): Promise<any> {
    return await this.service.sendOtpCode(data);
  }

  @ApiOperation({ summary: 'Lấy access token' })
  @Post('get-access-token')
  async getAccessToken(): Promise<any> {
    return await this.service.getAccessTokenWithRefreshToken(
      'feature_system_3',
    );
  }
}
