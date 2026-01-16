import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';

import { ActionLogController } from '../actionLog/actionLog.controller';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { AuthModule } from '../auth/auth.module';
import { AuthAdminController } from '../auth/controller/auth-admin.controller';
import { BlogModule } from '../blog/blog.module';
import { AdminBlogController } from '../blog/controller/admin-blog.controller';
import { PREFIX_MODULE } from '../config-module';
import { AdminCustomerController } from '../customer/controller/admin-customer.controller';
import { CustomerModule } from '../customer/customer.module';
import { AdminNotificationController } from '../notification/controller/admin-notification.controller';
import { NotificationModule } from '../notification/notification.module';
import { RoleController } from '../role/role.controller';
import { RoleModule } from '../role/role.module';
import { TourModule } from '../tour/tour.module';
import { AdminTranslationsController } from '../translations/controller/admin-translations.controller';
import { TranslationsModule } from '../translations/translations.module';
import { AdminTourController } from '../tour/controller/admin-tour.controller';
import { TourItinerariesModule } from '../tour-itineraries/tour-itineraries.module';
import { AdminTourItinerariesController } from '../tour-itineraries/controller/admin-tour-itineraries.controller';
import { TourPriceModule } from '../tour-price/tour-price.module';
import { TourDetailModule } from '../tour-detail/tour-detail.module';
import { Admin } from 'typeorm';
import { AdminTourDetailController } from '../tour-detail/controller/admin-tour-detail.controller';
import { AdminTourPriceController } from '../tour-price/controller/admin-tour-price.controller';

@ChildModule({
  prefix: PREFIX_MODULE.admin,
  controllers: [
    AuthAdminController,
    AdminCustomerController,
    ActionLogController,
    RoleController,
    AdminBlogController,
    AdminTranslationsController,
    AdminNotificationController,
    AdminTourController,
    AdminTourItinerariesController,
    AdminTourDetailController,
    AdminTourPriceController,
  ],
  imports: [
    AuthModule,
    ActionLogModule,
    CustomerModule,
    NotificationModule,
    RoleModule,
    BlogModule,
    TourModule,
    TranslationsModule,
    NotificationModule,
    TourModule,
    TourPriceModule,
    TourItinerariesModule,
    TourDetailModule,
  ],
  exports: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
