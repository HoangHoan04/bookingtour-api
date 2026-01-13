import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UploadFileRepository } from 'src/repositories/base.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { FileArchivalService } from './fileArchival.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UploadFileRepository])],
  controllers: [],
  providers: [FileArchivalService],
  exports: [FileArchivalService],
})
export class FileArchivalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
