import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { UserDto } from 'src/dto';
import {
  CheckPhoneEmailTourGuideDto,
  ForgotPasswordTourGuideDto,
  SendOtpTourGuideDto,
  UpdateTourGuideAvatarDto,
  UpdateTourGuideDto,
  VerifyOtpDto,
} from '../dto';
import { TourGuideService } from '../tour-guide.service';

@ApiTags('User - TourGuide')
@Controller('tour-guide')
export class UserTourGuideController {
  constructor(private readonly service: TourGuideService) {}

  @ApiOperation({ summary: 'Tìm hướng dẫn viên theo email hoặc số điện thoại' })
  @UseGuards(JwtAuthGuard)
  @Post('find-by-phone-email')
  async findByPhoneEmail(
    @Query('phone') phone: string,
    @Query('email') email: string,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.findByPhoneEmail(phone, email, user);
  }

  @ApiOperation({ summary: 'Gửi otp xác minh, quên mật khẩu tài khoản' })
  @Post('send-otp-verify')
  async sendOtpVerifyTourGuide(@Body() data: SendOtpTourGuideDto) {
    return await this.service.sendOtpVerifyTourGuide(data);
  }

  @ApiOperation({ summary: 'Xác thực mã OTP và cập nhật trạng thái xác minh' })
  @Post('verify-otp')
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return await this.service.verifyOtp(data);
  }

  @ApiOperation({ summary: 'Quên mật khẩu' })
  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordTourGuideDto) {
    return await this.service.forgotPassword(data);
  }

  @ApiOperation({ summary: 'Kiểm tra số điện thoại, email' })
  @Post('check-phone-email')
  async checkPhoneAndEmail(@Body() body: CheckPhoneEmailTourGuideDto) {
    return await this.service.checkPhoneAndEmail(body);
  }

  @ApiOperation({ summary: 'Cập nhật avatar hướng dẫn viên' })
  @UseGuards(JwtAuthGuard)
  @Post('update-avatar')
  async updateAvatar(
    @Body() data: UpdateTourGuideAvatarDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updateAvatar(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin hướng dẫn viên' })
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(@Body() data: UpdateTourGuideDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }
}
