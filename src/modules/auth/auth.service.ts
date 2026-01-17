import { HttpService } from '@nestjs/axios';
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
import { lastValueFrom } from 'rxjs';
import { enumData } from 'src/common/constants';
import { UserDto } from 'src/dto';
import { UserEntity } from 'src/entities';
import { CustomerEntity } from 'src/entities/user/customer.entity';
import { v4 as uuidv4 } from 'uuid';
import {
  CustomerRepository,
  UserRepository,
} from '../../repositories/user.repository';
import { FileArchivalCreateDto } from '../fileArchival/dto';
import { FileArchivalService } from '../fileArchival/fileArchival.service';
import {
  ChangePasswordDto,
  FacebookLoginDto,
  GoogleLoginDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  UserLoginDto,
  ZaloLoginDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly fileArchivalService: FileArchivalService,
  ) {}

  async login(data: UserLoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: data.username, isDeleted: false },
      relations: {
        customer: true,
        userRoles: {
          role: true,
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

    const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      lastLogin: new Date(),
      customer: user.customer,
      roles: user.userRoles?.map((ur) => ur.role),
    };

    return {
      user: userInfo,
      accessToken,
      refreshToken,
      message: 'Đăng nhập thành công',
    };
  }

  async loginWithZalo(data: ZaloLoginDto) {
    try {
      const zaloTokenData = await this.getZaloUserAccessToken(data.code);
      if (!zaloTokenData.access_token) {
        throw new BadRequestException('Không thể lấy access token từ Zalo');
      }
      const zaloUser = await this.getZaloUserInfo(zaloTokenData.access_token);
      if (!zaloUser.id) {
        throw new BadRequestException(
          'Không thể lấy thông tin người dùng từ Zalo',
        );
      }

      let user = await this.userRepo.findOne({
        where: { zaloId: zaloUser.id },
        relations: {
          customer: true,
        },
      });

      if (!user) {
        const customer = new CustomerEntity();
        customer.id = uuidv4();
        customer.code = `ZALO_${zaloUser.id}`;
        customer.name = zaloUser.name || 'Người dùng Zalo';
        customer.phone = zaloUser.phone || 'N/A';
        customer.email = `zalo_${zaloUser.id}@temporary.com`;
        customer.address = 'N/A';
        customer.gender = 'OTHER';
        customer.birthday = new Date('2000-01-01');
        customer.nationality = 'VN';
        customer.identityCard = `ZALO_${zaloUser.id.substring(0, 12)}`;
        customer.createdAt = new Date();
        customer.createdBy = 'zalo-oauth';

        await this.customerRepo.insert(customer);

        user = new UserEntity();
        user.id = uuidv4();
        user.username = customer.phone;
        user.email = customer.email || `${customer.code}@zalo.user`;
        user.password = customer.phone;
        user.isActive = true;
        user.isAdmin = false;
        user.customerId = customer.id;
        user.loginProvider = enumData.LoginProvider.ZALO;
        user.zaloId = zaloUser.id;
        user.isVerified = true;
        user.createdAt = new Date();

        await this.userRepo.insert(user);
      } else {
        if (!user.isActive) {
          throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
        }
      }

      const payload = { uid: user.id };
      const accessToken = this.jwtService.sign(payload);
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refresh-secret';
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

      const fullUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: {
          customer: true,
          userRoles: {
            role: true,
          },
        },
      });

      if (!fullUser) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      const userInfo = {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        isAdmin: fullUser.isAdmin,
        isActive: fullUser.isActive,
        lastLogin: new Date(),
        customer: fullUser.customer,
        roles: fullUser.userRoles?.map((ur) => ur.role),
      };

      return {
        user: userInfo,
        accessToken,
        refreshToken,
        message: 'Đăng nhập bằng Zalo thành công',
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đăng nhập bằng Zalo thất bại',
      );
    }
  }

  private async getZaloUserAccessToken(code: string) {
    try {
      const url = 'https://oauth.zaloapp.com/v4/access_token';

      const appId = this.configService.get<string>('ZNS_APP_ID') || '';
      const secretKey =
        this.configService.get<string>('ZALO_OAUTH_SECRET_KEY') || '';

      if (!appId || !secretKey) {
        throw new BadRequestException(
          'Thiếu cấu hình Zalo App ID hoặc Secret Key',
        );
      }

      const params = new URLSearchParams();
      params.append('code', code);
      params.append('app_id', appId);
      params.append('grant_type', 'authorization_code');

      const response = await lastValueFrom(
        this.httpService.post(url, params.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            secret_key: secretKey,
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error getting Zalo access token:', error);
      throw new BadRequestException('Không thể lấy access token từ Zalo');
    }
  }

  private async getZaloUserInfo(accessToken: string) {
    try {
      const url = 'https://graph.zalo.me/v2.0/me';

      const response = await lastValueFrom(
        this.httpService.get(url, {
          params: {
            access_token: accessToken,
            fields: 'id,name,picture',
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error getting Zalo user info:', error);
      throw new BadRequestException(
        'Không thể lấy thông tin người dùng từ Zalo',
      );
    }
  }

  async loginWithGoogle(data: GoogleLoginDto) {
    try {
      const googleUser = await this.verifyGoogleIdToken(data.idToken);

      if (!googleUser.sub) {
        throw new BadRequestException('Token Google không hợp lệ');
      }
      let user = await this.userRepo.findOne({
        where: { googleId: googleUser.sub },
        relations: { customer: true },
      });
      if (!user && googleUser.email) {
        const existingUser = await this.userRepo.findOne({
          where: { email: googleUser.email },
          relations: { customer: true },
        });
        if (existingUser) {
          await this.userRepo.update(existingUser.id, {
            googleId: googleUser.sub,
            loginProvider:
              existingUser.loginProvider || enumData.LoginProvider.GOOGLE,
            isVerified: true,
          });

          if (existingUser.customerId && googleUser.picture) {
            const fileArchival = new FileArchivalCreateDto();
            fileArchival.fileUrl = googleUser.picture;
            fileArchival.fileName = `google_avatar_${googleUser.sub}`;
            fileArchival.fileType = 'CUSTOMER_AVATAR';
            fileArchival.fileRelationName = 'customerId';
            fileArchival.fileRelationId = existingUser.customerId;
            fileArchival.createdBy = 'google-oauth';
            fileArchival.createdAt = new Date().toISOString();

            await this.fileArchivalService.create(fileArchival);
          }

          user = await this.userRepo.findOne({
            where: { id: existingUser.id },
            relations: { customer: true },
          });
        }
      }

      if (!user) {
        const customer = new CustomerEntity();
        customer.id = uuidv4();
        customer.code = `GOOGLE_${googleUser.sub.substring(0, 10)}`;
        customer.name = googleUser.name || 'Người dùng Google';
        customer.email =
          googleUser.email || `google_${googleUser.sub}@temporary.com`;
        customer.phone = 'N/A';
        customer.address = 'N/A';
        customer.gender = 'OTHER';
        customer.birthday = new Date('2000-01-01');
        customer.nationality = 'VN';
        customer.identityCard = '';
        customer.passportNumber = '';
        customer.createdAt = new Date();
        customer.createdBy = 'google-oauth';

        await this.customerRepo.insert(customer);

        if (googleUser.picture) {
          const fileArchival = new FileArchivalCreateDto();
          fileArchival.fileUrl = googleUser.picture;
          fileArchival.fileName = `google_avatar_${googleUser.sub}`;
          fileArchival.fileType = 'CUSTOMER_AVATAR';
          fileArchival.fileRelationName = 'customerId';
          fileArchival.fileRelationId = customer.id;
          fileArchival.createdBy = 'google-oauth';
          fileArchival.createdAt = new Date().toISOString();

          await this.fileArchivalService.create(fileArchival);
        }

        user = new UserEntity();
        user.id = uuidv4();
        user.username = customer.phone;
        user.email = googleUser.email || `${customer.code}@google.com`;
        user.password = customer.email;
        user.isActive = true;
        user.isAdmin = false;
        user.customerId = customer.id;
        user.googleId = googleUser.sub;
        user.loginProvider = enumData.LoginProvider.GOOGLE;
        user.isVerified = true;
        user.createdAt = new Date();
        user.createdBy = 'google-oauth';

        await this.userRepo.insert(user);
      } else {
        if (!user.isActive) {
          throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
        }
      }

      const payload = { uid: user.id };
      const accessToken = this.jwtService.sign(payload);

      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refresh-secret';
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

      const fullUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: {
          customer: true,
          userRoles: {
            role: true,
          },
        },
      });

      if (!fullUser) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      const userInfo = {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        isAdmin: fullUser.isAdmin,
        isActive: fullUser.isActive,
        lastLogin: new Date(),
        customer: fullUser.customer,
        roles: fullUser.userRoles?.map((ur) => ur.role),
      };

      return {
        user: userInfo,
        accessToken,
        refreshToken,
        message: 'Đăng nhập bằng Google thành công',
      };
    } catch (error) {
      console.error('Login Google Error:', error);
      throw new BadRequestException(
        error.message || 'Đăng nhập bằng Google thất bại',
      );
    }
  }

  private async verifyGoogleIdToken(token: string) {
    try {
      const url = `https://www.googleapis.com/oauth2/v3/userinfo`;

      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      const tokenInfo = response.data;
      if (tokenInfo.email_verified === false) {
        throw new BadRequestException('Email Google chưa được xác thực');
      }

      return {
        sub: tokenInfo.sub,
        email: tokenInfo.email,
        name: tokenInfo.name,
        picture: tokenInfo.picture,
      };
    } catch (error) {
      console.error(
        'Error verifying Google token:',
        error?.response?.data || error.message,
      );
      throw new BadRequestException(
        'Token Google không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  async loginWithFacebook(data: FacebookLoginDto) {
    try {
      const fbUser = await this.getFacebookUserInfo(data.accessToken);
      if (!fbUser.id) {
        throw new BadRequestException('Token Facebook không hợp lệ');
      }
      let user = await this.userRepo.findOne({
        where: { facebookId: fbUser.id },
        relations: { customer: true },
      });

      if (!user) {
        if (fbUser.email) {
          const existingUser = await this.userRepo.findOne({
            where: { email: fbUser.email },
            relations: { customer: true },
          });

          if (existingUser) {
            await this.userRepo.update(existingUser.id, {
              facebookId: fbUser.id,
              isVerified: true,
            });

            user = await this.userRepo.findOne({
              where: { id: existingUser.id },
              relations: { customer: true },
            });
          }
        }

        if (!user) {
          const customer = new CustomerEntity();
          customer.id = uuidv4();
          customer.code = `FB_${fbUser.id.substring(0, 20)}`;
          customer.name = fbUser.name || 'Người dùng Facebook';
          customer.email = fbUser.email || `fb_${fbUser.id}@temporary.com`;
          customer.phone = fbUser.phone || 'N/A';
          customer.address = 'N/A';
          customer.gender = 'OTHER';
          customer.birthday = new Date('2000-01-01');
          customer.nationality = 'VN';
          customer.identityCard = `FB_${fbUser.id.substring(0, 12)}`;
          customer.createdAt = new Date();
          customer.createdBy = 'facebook-oauth';

          await this.customerRepo.insert(customer);

          if (fbUser.picture?.data?.url) {
            const fileArchival = new FileArchivalCreateDto();
            fileArchival.fileUrl = fbUser.picture.data.url;
            fileArchival.fileName = `facebook_avatar_${fbUser.id}`;
            fileArchival.fileType = 'CUSTOMER_AVATAR';
            fileArchival.fileRelationName = 'customerId';
            fileArchival.fileRelationId = customer.id;
            fileArchival.createdBy = 'facebook-oauth';
            fileArchival.createdAt = new Date().toISOString();

            await this.fileArchivalService.create(fileArchival);
          }

          user = new UserEntity();
          user.id = uuidv4();
          user.username = customer.phone;
          user.email = fbUser.email || `${customer.phone}@facebook.user`;
          user.password = uuidv4();
          user.isActive = true;
          user.isAdmin = false;
          user.customerId = customer.id;
          user.facebookId = fbUser.id;
          user.loginProvider = enumData.LoginProvider.FACEBOOK;
          user.isVerified = true;
          user.createdAt = new Date();
          user.createdBy = 'facebook-oauth';

          await this.userRepo.insert(user);
        }
      } else {
        if (!user.isActive)
          throw new UnauthorizedException('Tài khoản bị vô hiệu hóa');
      }

      const payload = { uid: user.id };
      const accessToken = this.jwtService.sign(payload);

      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET') ||
        'refresh-secret';
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

      const fullUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: {
          customer: true,
          userRoles: {
            role: true,
          },
        },
      });

      if (!fullUser) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      const userInfo = {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        isAdmin: fullUser.isAdmin,
        isActive: fullUser.isActive,
        lastLogin: new Date(),
        customer: fullUser.customer,
        roles: fullUser.userRoles?.map((ur) => ur.role),
      };

      return {
        user: userInfo,
        accessToken,
        refreshToken,
        message: 'Đăng nhập bằng Facebook thành công',
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Đăng nhập Facebook thất bại',
      );
    }
  }

  private async getFacebookUserInfo(accessToken: string) {
    try {
      const url = `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`;
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      console.error(
        'Error verifying Facebook token:',
        error?.response?.data || error.message,
      );
      throw new BadRequestException('Token Facebook không hợp lệ hoặc hết hạn');
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
      relations: {
        customer: true,
        userRoles: {
          role: true,
        },
      },
    });

    if (!currentUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const userInfo = {
      id: currentUser.id,
      username: currentUser.username,
      email: currentUser.email,
      isAdmin: currentUser.isAdmin,
      isActive: currentUser.isActive,
      lastLogin: currentUser.lastLogin,
      createdAt: currentUser.createdAt,
      loginProvider: currentUser.loginProvider,
      isVerified: currentUser.isVerified,
      customer: currentUser.customer,
      roles: currentUser.userRoles?.map((ur) => ur.role),
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
