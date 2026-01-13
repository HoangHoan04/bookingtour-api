import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  NotificationRecipientRepository,
  NotificationRepository,
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
      NotificationRecipientRepository,
      UserRepository,
    ]),
  ],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
