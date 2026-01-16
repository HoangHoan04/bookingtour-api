import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  TourDetailRepository,
  TourItinerarieRepository,
  TourPriceRepository,
  TourRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';
import { TourService } from '../tour/tour.service';
import { TourItinerarieService } from './tour-inineraries.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TourRepository,
      TourDetailRepository,
      TourPriceRepository,
      TourItinerarieRepository,
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
