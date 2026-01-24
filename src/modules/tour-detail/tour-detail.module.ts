import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  TourDetailRepository,
  TourItinerarieRepository,
  TourPriceRepository,
  TourRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { TourDetailService } from './tour-detail.service';

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
  exports: [TourDetailService],
  controllers: [],
  providers: [TourDetailService],
})
export class TourDetailModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
