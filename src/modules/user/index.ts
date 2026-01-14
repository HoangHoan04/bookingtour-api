import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { PREFIX_MODULE } from '../config-module';
import { UserCustomerController } from '../customer/controller/customer-user.controller';
import { CustomerModule } from '../customer/customer.module';

@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [AuthUserController, UserCustomerController],
  imports: [AuthModule, CustomerModule],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
