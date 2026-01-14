import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TokenPayload } from 'src/modules/auth/dto/auth.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(userId: string): string {
    const payload: TokenPayload = { uid: userId };
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(userId: string): string {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret';
    const refreshExpiry =
      this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';

    const payload: TokenPayload = { uid: userId, isRefreshToken: true };
    return jwt.sign(payload, refreshSecret, {
      expiresIn: refreshExpiry,
    } as jwt.SignOptions);
  }

  async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  async compareToken(
    plainToken: string,
    hashedToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainToken, hashedToken);
  }

  verifyRefreshToken(token: string): TokenPayload {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret';
    return jwt.verify(token, refreshSecret) as TokenPayload;
  }
}
