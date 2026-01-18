import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { BlogModule } from '../blog/blog.module';
import { UserBlogController } from '../blog/controller/user-blog.controller';
import { PREFIX_MODULE } from '../config-module';
import { UserCustomerController } from '../customer/controller/user-customer.controller';
import { CustomerModule } from '../customer/customer.module';
import { UserNotificationController } from '../notification/controller/user-notification.controller';
import { NotificationModule } from '../notification/notification.module';
import { UserTourDetailController } from '../tour-detail/controller/user-tour-detail.controller';
import { TourDetailModule } from '../tour-detail/tour-detail.module';
import { UserTourItinerariesController } from '../tour-itineraries/controller/user-tour-itineraries.controller';
import { TourItinerariesModule } from '../tour-itineraries/tour-itineraries.module';
import { UserTourPriceController } from '../tour-price/controller/user-tour-price.controller';
import { TourPriceModule } from '../tour-price/tour-price.module';
import { UserTourController } from '../tour/controller/user-tour.controller';
import { TourModule } from '../tour/tour.module';

@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [
    AuthUserController,
    UserCustomerController,
    UserNotificationController,
    UserTourController,
    UserTourItinerariesController,
    UserTourDetailController,
    UserTourPriceController,
    UserBlogController,
  ],
  imports: [
    AuthModule,
    CustomerModule,
    NotificationModule,
    TourModule,
    TourPriceModule,
    TourItinerariesModule,
    TourDetailModule,
    BlogModule,
  ],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
