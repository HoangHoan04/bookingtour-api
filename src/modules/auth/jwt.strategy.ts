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

  /** Xác thực token jwt */
  async validate(payload: { uid: string; isRefreshToken?: boolean }) {
    if (payload.isRefreshToken)
      throw new UnauthorizedException(
        'Không thể dùng refresh token để xác thực',
      );

    const user = await this.userRepo.findOne({
      where: { id: payload.uid, isDeleted: false },
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
      throw new UnauthorizedException('Không có quyền truy cập!');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị ngưng hoạt động');
    }

    const enhancedUser = {
      ...user,
      roles: user.userRoles?.map((ur) => ur.role),
      permissions: user.userRoles
        ?.flatMap((ur) => ur.role.rolePermissions?.map((rp) => rp.permission))
        .filter(Boolean),
    };

    return enhancedUser;
  }
}
