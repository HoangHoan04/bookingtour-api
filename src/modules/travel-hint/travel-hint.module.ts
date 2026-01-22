import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileArchivalRepository } from 'src/repositories';
import { TravelHintRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { UploadFileModule } from '../upload-file';
import { TravelHintService } from './travel-hint.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TravelHintRepository,
      FileArchivalRepository,
    ]),
    ActionLogModule,
    UploadFileModule,
    FileArchivalModule,
  ],
  controllers: [],
  providers: [TravelHintService],
  exports: [TravelHintService],
})
export class TravelHintModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
