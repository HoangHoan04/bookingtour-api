import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { UserDto } from 'src/dto';
import { AuthService } from '../auth.service';
import {
  ChangePasswordDto,
  FacebookLoginDto,
  GoogleLoginDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  UserLoginDto,
  ZaloLoginDto,
} from '../dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthUserController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(@Body() data: UserLoginDto) {
    return await this.service.login(data);
  }

  @Post('login/zalo')
  async loginWithZalo(@Body() data: ZaloLoginDto) {
    return await this.service.loginWithZalo(data);
  }

  @Post('login/google')
  async loginWithGoogle(@Body() data: GoogleLoginDto) {
    return await this.service.loginWithGoogle(data);
  }

  @Post('login/facebook')
  async loginWithFacebook(@Body() data: FacebookLoginDto) {
    return await this.service.loginWithFacebook(data);
  }

  @Post('refresh-token')
  async refreshToken(@Body() data: RefreshTokenDto) {
    return await this.service.refreshToken(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  async updatePassword(
    @Body() info: UpdatePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updatePassword(info, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() info: ChangePasswordDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.changePassword(info, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async getUserInfo(@CurrentUser() user: UserDto) {
    return await this.service.getUserInfo(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: UserDto) {
    return await this.service.logout(user);
  }
}
