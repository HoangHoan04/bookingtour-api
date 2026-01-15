import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileArchivalRepository } from 'src/repositories';
import { NewsRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';
import { UploadFileModule } from '../upload-file';
import { NewsService } from './news.service';

@Module({
  providers: [NewsService],
  controllers: [],
  exports: [NewsService],
  imports: [
    TypeOrmExModule.forCustomRepository([
      NewsRepository,
      FileArchivalRepository,
    ]),
    ActionLogModule,
    UploadFileModule,
    FileArchivalModule,
  ],
})
export class NewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
