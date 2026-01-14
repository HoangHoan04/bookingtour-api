import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  CustomerRepository,
  FileArchivalRepository,
  UserRepository,
} from '../../repositories';
import { TypeOrmExModule } from '../../typeorm';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRY') || '1h') as any,
        },
      }),
    }),
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      CustomerRepository,
      FileArchivalRepository,
    ]),
    HttpModule,
    FileArchivalModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
