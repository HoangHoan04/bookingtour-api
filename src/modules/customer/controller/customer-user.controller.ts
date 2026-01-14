import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { UserDto } from 'src/dto';
import { CustomerService } from '../customer.service';
import {
  CheckPhoneEmailCustomerDto,
  ForgotPasswordCustomerDto,
  RegisterCustomerDto,
  SendOtpCustomerDto,
  VerifyOtpDto,
} from '../dto';
import {
  UpdateCustomerAvatarDto,
  UpdateCustomerDto,
} from '../dto/updateCustomer.dto';

@ApiTags('User - Customer')
@Controller('customer')
export class UserCustomerController {
  constructor(private readonly service: CustomerService) {}

  @ApiOperation({ summary: 'Tìm khách hàng theo email hoặc số điện thoại' })
  @UseGuards(JwtAuthGuard)
  @Post('find-by-phone-email')
  async findByPhoneEmail(
    @Query('phone') phone: string,
    @Query('email') email: string,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.findByPhoneEmail(phone, email, user);
  }

  @ApiOperation({ summary: 'Khách hàng đăng ký tài khoản' })
  @Post('register')
  async register(@Body() data: RegisterCustomerDto) {
    return await this.service.register(data);
  }

  @ApiOperation({ summary: 'Gửi otp đăng ký tài khoản' })
  @Post('send-otp')
  async sendOtpRegisterCustomer(@Body() data: SendOtpCustomerDto) {
    return await this.service.sendOtpRegisterCustomer(data);
  }

  @ApiOperation({ summary: 'Gửi otp xác minh, quên mật khẩu tài khoản' })
  @Post('send-otp-verify')
  async sendOtpVerifyCustomer(@Body() data: SendOtpCustomerDto) {
    return await this.service.sendOtpVerifyCustomer(data);
  }

  @ApiOperation({ summary: 'Xác thực mã OTP và cập nhật trạng thái xác minh' })
  @Post('verify-otp')
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return await this.service.verifyOtp(data);
  }

  @ApiOperation({ summary: 'Quên mật khẩu' })
  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordCustomerDto) {
    return await this.service.forgotPassword(data);
  }

  @ApiOperation({ summary: 'Kiểm tra số điện thoại, email' })
  @Post('check-phone-email')
  async checkPhoneAndEmail(@Body() body: CheckPhoneEmailCustomerDto) {
    return await this.service.checkPhoneAndEmail(body);
  }

  @ApiOperation({ summary: 'Cập nhật avatar khách hàng' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @Post('update-avatar')
  async updateAvatar(
    @Body() data: UpdateCustomerAvatarDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updateAvatar(user, data);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin khách hàng' })
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async update(@Body() data: UpdateCustomerDto, @CurrentUser() user: UserDto) {
    return await this.service.update(user, data);
  }
}
