import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { coreHelper } from 'src/helpers/coreHelper';
import { UserDto } from '../../dto/user.dto';
import { UserRepository } from '../../repositories';
import { NotificationService } from '../notification/notification.service';
import {
  ChangePasswordDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  UserLoginDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  async login(data: UserLoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: data.username, isDeleted: false },
      relations: {
        employee: true,
        userRoles: {
          role: {
            rolePermissions: {
              permission: true,
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const payload = { uid: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret';
    const refreshExpiry =
      this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';

    const refreshTokenPayload = { uid: user.id, isRefreshToken: true };
    const refreshToken = jwt.sign(refreshTokenPayload, refreshSecret, {
      expiresIn: refreshExpiry,
    } as jwt.SignOptions);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(user.id, {
      refreshToken: hashedRefreshToken,
      lastLogin: new Date(),
    });

    await this.createLoginNotification(user);

    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      lastLogin: new Date(),
      employee: user.employee,
      roles: user.userRoles?.map((ur) => ur.role),
    };

    return {
      user: userInfo,
      accessToken,
      refreshToken,
      message: 'Đăng nhập thành công',
    };
  }

  private async createLoginNotification(user: any) {
    try {
      const userName = user.employee?.fullName || user.username;

      await this.notificationService.createNotifyAdmin(user.id, {
        title: 'Thông báo đăng nhập mới',
        content: `Người dùng "${userName}" (${user.username}) đã đăng nhập vào hệ thống lúc ${coreHelper.formatDateTime(new Date())}.`,
        type: 'Đăng nhập',
        priority: 'normal',
        targetAudience: 'admins',
      });
    } catch (error) {
      console.error('Error creating login notification:', error);
    }
  }

  async refreshToken(data: RefreshTokenDto) {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refresh-secret';
      const payload = jwt.verify(data.refreshToken, refreshSecret) as any;

      if (!payload.isRefreshToken) {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const user = await this.userRepo.findOne({
        where: { id: payload.uid, isDeleted: false },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException(
          'Người dùng không tồn tại hoặc đã bị vô hiệu hóa',
        );
      }

      if (!user.refreshToken) {
        throw new UnauthorizedException('Refresh token không tồn tại');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        data.refreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const newPayload = { uid: user.id };
      const newAccessToken = this.jwtService.sign(newPayload);

      return {
        accessToken: newAccessToken,
        message: 'Làm mới token thành công',
      };
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  async updatePassword(
    { currentPassword, newPassword }: UpdatePasswordDto,
    user: UserDto,
  ) {
    const currentUser = await this.userRepo.findOne({
      where: { id: user.id, isDeleted: false },
    });

    if (!currentUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      currentUser.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepo.update(user.id, {
      password: hashedNewPassword,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    return {
      message: 'Cập nhật mật khẩu thành công',
    };
  }

  async changePassword(
    { currentPassword, newPassword, confirmPassword }: ChangePasswordDto,
    user: UserDto,
  ) {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu mới và xác nhận mật khẩu không khớp',
      );
    }

    return this.updatePassword({ currentPassword, newPassword }, user);
  }

  async getUserInfo(user: UserDto) {
    const currentUser = await this.userRepo.findOne({
      where: { id: user.id, isDeleted: false },
    });

    if (!currentUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const userInfo = {
      username: currentUser.username,
      createdAt: currentUser.createdAt,
      isAdmin: currentUser.isAdmin,
      roles: currentUser.userRoles?.map((ur) => ({
        ...ur.role,
        permissions: ur.role.rolePermissions?.map((rp) => rp.permission),
      })),
    };

    return {
      user: userInfo,
      message: 'Lấy thông tin người dùng thành công',
    };
  }

  async logout(user: UserDto) {
    await this.userRepo.update(user.id, {
      refreshToken: undefined,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    return {
      message: 'Đăng xuất thành công',
    };
  }
}
