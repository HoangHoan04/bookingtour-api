import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';
import { AuthModule } from '../auth/auth.module';
import { AuthUserController } from '../auth/controller/auth-user.controller';
import { PREFIX_MODULE } from '../config-module';
import { UserCustomerController } from '../customer/controller/user-customer.controller';
import { CustomerModule } from '../customer/customer.module';
import { UserNotificationController } from '../notification/controller/user-notification.controller';
import { NotificationModule } from '../notification/notification.module';
import { TourModule } from '../tour/tour.module';
import { UserTourController } from '../tour/controller/user-tour.controller';
import { TourItinerariesModule } from '../tour-itineraries/tour-itineraries.module';
import { UserTourItinerariesController } from '../tour-itineraries/controller/user-tour-itineraries.controller';
import { UserTourDetailController } from '../tour-detail/controller/user-tour-detail.controller';
import { TourDetailModule } from '../tour-detail/tour-detail.module';
import { TourPriceModule } from '../tour-price/tour-price.module';
import { UserTourPriceController } from '../tour-price/controller/user-tour-price.controller';
import { UserBookingController } from '../booking/controller/user-booking.controller';
import { BookingModule } from '../booking/booking.module';
import { UserPaymentController } from '../payment/controller/user-payment.controller';
import { PaymentModule } from '../payment/payment.module';

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
    UserBookingController,
    UserPaymentController,
  ],
  imports: [
    AuthModule,
    CustomerModule,
    NotificationModule,
    TourModule,
    TourPriceModule,
    TourItinerariesModule,
    TourDetailModule,
    BookingModule,
    PaymentModule,
  ],
  exports: [],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
