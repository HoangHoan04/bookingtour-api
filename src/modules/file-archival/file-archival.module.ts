import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileArchivalRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { FileArchivalService } from './file-archival.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([FileArchivalRepository])],
  controllers: [],
  providers: [FileArchivalService],
  exports: [FileArchivalService],
})
export class FileArchivalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
