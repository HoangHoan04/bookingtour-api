import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileArchivalRepository } from 'src/repositories';
import { BannerRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { UploadFileModule } from '../upload-file';
import { BannerService } from './banner.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BannerRepository,
      FileArchivalRepository,
    ]),
    ActionLogModule,
    UploadFileModule,
    FileArchivalModule,
  ],
  controllers: [],
  providers: [BannerService],
  exports: [BannerService],
})
export class BannerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
