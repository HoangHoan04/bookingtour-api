import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  CustomerRepository,
  UserRepository,
  VerifyOtpRepository,
} from 'src/repositories';
import { FileArchivalRepository } from 'src/repositories/base.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { EmailModule } from '../email/email.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { NotificationModule } from '../notification/notification.module';
import { ZaloModule } from '../zalo/zalo.module';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      VerifyOtpRepository,
      FileArchivalRepository,
      CustomerRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
    ZaloModule,
    EmailModule,
    NotificationModule,
  ],
  exports: [CustomerService],
  controllers: [],
  providers: [CustomerService],
})
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
