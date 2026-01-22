import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  TourGuideRepository,
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
import { TourGuideService } from './tour-guide.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      VerifyOtpRepository,
      FileArchivalRepository,
      TourGuideRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
    ZaloModule,
    EmailModule,
    NotificationModule,
  ],
  exports: [TourGuideService],
  controllers: [],
  providers: [TourGuideService],
})
export class TourGuideModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
