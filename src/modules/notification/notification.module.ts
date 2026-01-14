import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  NotificationRepository,
  NotificationSettingRepository,
  UserRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
  imports: [
    TypeOrmExModule.forCustomRepository([
      NotificationRepository,
      NotificationSettingRepository,
      UserRepository,
    ]),
  ],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
