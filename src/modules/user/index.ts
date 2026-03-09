import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { BannerModule } from '../banner/banner.module';
import { UserBannerController } from '../banner/controllers/user-banner.controller';
import { BlogModule } from '../blog/blog.module';
import { UserBlogController } from '../blog/controller/user-blog.controller';
import { BookingModule } from '../booking/booking.module';
import { UserBookingController } from '../booking/controller/user-booking.controller';
import { PREFIX_MODULE } from '../config-module';
import { UserCustomerController } from '../customer/controller/user-customer.controller';
import { CustomerModule } from '../customer/customer.module';
import { UserDestinationController } from '../destination/controller/user-destination.controller';
import { DestinationModule } from '../destination/destination.module';
import { UserNewsController } from '../news/controllers/user-news.controller';
import { NewsModule } from '../news/new.module';
import { UserNewsletterController } from '../newsletter/newsletter.controller';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { UserNotificationController } from '../notification/controller/user-notification.controller';
import { NotificationModule } from '../notification/notification.module';
import { UserPaymentController } from '../payment/controller/user-payment.controller';
import { PaymentModule } from '../payment/payment.module';
import { UserTourGuideController } from '../tour-guide/controllers/user-tour-guide.controller';
import { TourGuideModule } from '../tour-guide/tour-guide.module';
import { UserTourItinerariesController } from '../tour-itineraries/controller/user-tour-itineraries.controller';
import { TourItinerariesModule } from '../tour-itineraries/tour-itineraries.module';
import { UserTourPriceController } from '../tour-price/controller/user-tour-price.controller';
import { TourPriceModule } from '../tour-price/tour-price.module';
import { UserTourController } from '../tour/controller/user-tour.controller';
import { TourModule } from '../tour/tour.module';
import { UserTravelHintController } from '../travel-hint/controller/user-travel-hint.controller';
import { TravelHintModule } from '../travel-hint/travel-hint.module';

@ChildModule({
  prefix: PREFIX_MODULE.user,
  controllers: [
    AuthUserController,
    UserCustomerController,
    UserNotificationController,
    UserTourController,
    UserTourItinerariesController,
    UserTourPriceController,
    UserBookingController,
    UserPaymentController,
    UserBlogController,
    UserBannerController,
    UserNewsController,
    UserNewsletterController,
    UserTourGuideController,
    UserTravelHintController,
    UserDestinationController,
  ],
  imports: [
    AuthModule,
    CustomerModule,
    NotificationModule,
    TourModule,
    TourPriceModule,
    TourItinerariesModule,
    BookingModule,
    PaymentModule,
    BlogModule,
    BannerModule,
    NewsModule,
    NewsletterModule,
    TourGuideModule,
    TravelHintModule,
    DestinationModule,
  ],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
