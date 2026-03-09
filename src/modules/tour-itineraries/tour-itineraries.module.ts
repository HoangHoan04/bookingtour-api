import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  ReviewRepository,
  TourDetailRepository,
  TourItinerarieRepository,
  TourPriceRepository,
  TourRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { TourService } from '../tour/tour.service';
import { TourItinerarieService } from './tour-inineraries.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TourRepository,
      TourDetailRepository,
      TourPriceRepository,
      TourItinerarieRepository,
      ReviewRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
  ],
  exports: [TourItinerarieService, TourService],
  controllers: [],
  providers: [TourService, TourItinerarieService],
})
export class TourItinerariesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
