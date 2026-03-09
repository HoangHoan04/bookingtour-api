import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  BookingRepository,
  ReviewRepository,
  TourDetailRepository,
  TourRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { TourService } from './tour.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TourRepository,
      TourDetailRepository,
      ReviewRepository,
      BookingRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
  ],
  exports: [TourService],
  controllers: [],
  providers: [TourService],
})
export class TourModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
