import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';

import { ActionLogController } from '../actionLog/actionLog.controller';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { AuthModule } from '../auth/auth.module';
import { AuthAdminController } from '../auth/controller/auth-admin.controller';
import { BannerModule } from '../banner/banner.module';
import { AdminBannerController } from '../banner/controllers/admin-banner.controller';
import { BlogModule } from '../blog/blog.module';
import { AdminBlogController } from '../blog/controller/admin-blog.controller';
import { PREFIX_MODULE } from '../config-module';
import { AdminCustomerController } from '../customer/controller/admin-customer.controller';
import { CustomerModule } from '../customer/customer.module';
import { AdminDestinationController } from '../destination/controller/admin-destination.controller';
import { DestinationModule } from '../destination/destination.module';
import { AdminNewsController } from '../news/controllers/admin-news.controller';
import { NewsModule } from '../news/new.module';
import { AdminNotificationController } from '../notification/controller/admin-notification.controller';
import { NotificationModule } from '../notification/notification.module';
import { RoleController } from '../role/role.controller';
import { RoleModule } from '../role/role.module';
import { AdminTourGuideController } from '../tour-guide/controllers/admin-tour-guide.controller';
import { TourGuideModule } from '../tour-guide/tour-guide.module';
import { AdminTourItinerariesController } from '../tour-itineraries/controller/admin-tour-itineraries.controller';
import { TourItinerariesModule } from '../tour-itineraries/tour-itineraries.module';
import { AdminTourPriceController } from '../tour-price/controller/admin-tour-price.controller';
import { TourPriceModule } from '../tour-price/tour-price.module';
import { AdminTourController } from '../tour/controller/admin-tour.controller';
import { TourModule } from '../tour/tour.module';
import { AdminTranslationsController } from '../translations/controller/admin-translations.controller';
import { TranslationsModule } from '../translations/translations.module';
import { AdminTravelHintController } from '../travel-hint/controller/admin-travel-hint.controller';
import { TravelHintModule } from '../travel-hint/travel-hint.module';
import { Admin } from 'typeorm';
import { AdminTourDetailController } from '../tour-detail/controller/admin-tour-detail.controller';
import { TourDetailModule } from '../tour-detail/tour-detail.module';

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
    AdminTourDetailController,
    AdminTourItinerariesController,
    AdminTourPriceController,
    AdminBannerController,
    AdminNewsController,
    AdminDestinationController,
    AdminTourGuideController,
    AdminTravelHintController,
  ],
  imports: [
    AuthModule,
    ActionLogModule,
    CustomerModule,
    NotificationModule,
    RoleModule,
    TourModule,
    TourDetailModule,
    TranslationsModule,
    NotificationModule,
    TourModule,
    TourPriceModule,
    TourItinerariesModule,
    BannerModule,
    NewsModule,
    BlogModule,
    DestinationModule,
    TourGuideModule,
    TravelHintModule,
  ],
  exports: [],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
