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
import { TourPriceService } from './tour-price.service';
import { GenerateCodeHelper } from 'src/helpers/generateCodeHelper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TourRepository,
      TourDetailRepository,
      TourPriceRepository,
      TourItinerarieRepository,
    ]),
    ActionLogModule,
    GenerateCodeHelper,
    FileArchivalModule,
  ],
  exports: [TourPriceService],
  controllers: [],
  providers: [TourPriceService],
})
export class TourPriceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
