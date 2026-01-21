import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';
import { BookingService } from './booking.service';
import {
  BookingDetailRepository,
  BookingRepository,
  TourDetailRepository,
  TourPriceRepository,
  TourRepository,
} from 'src/repositories/tour.repository';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BookingRepository,
      BookingDetailRepository,
      TourRepository,
      TourPriceRepository,
      TourDetailRepository,
    ]),
    ActionLogModule,
    PaymentModule,
    FileArchivalModule,
  ],
  exports: [BookingService],
  controllers: [],
  providers: [BookingService],
})
export class BookingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
