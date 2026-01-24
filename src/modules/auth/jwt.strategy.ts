import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ConfigService,
    private readonly userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: { uid: string; isRefreshToken?: boolean }) {
    if (payload.isRefreshToken)
      throw new UnauthorizedException(
        'Không thể dùng refresh token để xác thực',
      );

    const user = await this.userRepo.findOne({
      where: { id: payload.uid, isDeleted: false },
      relations: {
        userRoles: {
          role: true,
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Không có quyền truy cập!');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị ngưng hoạt động');
    }

    const roles = user.userRoles?.map((ur) => ur.role) || [];
    const permissionSet = new Set<string>();
    user.userRoles?.forEach((ur) => {
      if (ur.role?.permissions && Array.isArray(ur.role.permissions)) {
        ur.role.permissions.forEach((permission) => {
          permissionSet.add(permission);
        });
      }
    });

    const permissions = Array.from(permissionSet);

    const enhancedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      customerId: user.customerId,
      roles,
      permissions,
    };

    return enhancedUser;
  }
}
