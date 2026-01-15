import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { PREFIX_MODULE } from '../config-module';
import { UserCustomerController } from '../customer/controller/user-customer.controller';
import { CustomerModule } from '../customer/customer.module';
import { UserNotificationController } from '../notification/controller/user-notification.controller';
import { NotificationModule } from '../notification/notification.module';

@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [
    AuthUserController,
    UserCustomerController,
    UserNotificationController,
  ],
  imports: [AuthModule, CustomerModule, NotificationModule],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
