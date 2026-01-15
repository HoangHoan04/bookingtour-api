import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BannerRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';
import { UploadFileModule } from '../upload-file';
import { BannerService } from './banner.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BannerRepository]),
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
