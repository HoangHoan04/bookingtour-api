import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ChildModule } from 'src/common/decorators/module.decorator';
import { PREFIX_MODULE } from '../config-module';
import { UploadFileController } from './updoadFile.controller';
import { UploadFileService } from './uploadFile.service';

@ChildModule({
  prefix: PREFIX_MODULE.upload,
  controllers: [UploadFileController],
  imports: [
    ConfigModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
