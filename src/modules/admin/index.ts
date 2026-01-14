import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';

import { ActionLogController } from '../actionLog/actionLog.controller';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { AuthModule } from '../auth/auth.module';
import { AuthAdminController } from '../auth/controller/auth-admin.controller';
import { PREFIX_MODULE } from '../config-module';
import { CustomerAdminController } from '../customer/controller/customer-admin.controller';
import { CustomerModule } from '../customer/customer.module';
import { NotificationModule } from '../notification/notification.module';
import { RoleController } from '../role/role.controller';
import { RoleModule } from '../role/role.module';

@ChildModule({
  prefix: PREFIX_MODULE.admin,
  controllers: [
    AuthAdminController,
    CustomerAdminController,
    ActionLogController,
    RoleController,
  ],
  imports: [
    AuthModule,
    ActionLogModule,
    CustomerModule,
    NotificationModule,
    RoleModule,
  ],
  exports: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
