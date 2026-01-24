import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileArchivalRepository, TourRepository } from 'src/repositories';
import { DestinationRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { DestinationService } from './destination.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      DestinationRepository,
      TourRepository,
      FileArchivalRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
  ],
  exports: [DestinationService],
  controllers: [],
  providers: [DestinationService],
})
export class DestinationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
