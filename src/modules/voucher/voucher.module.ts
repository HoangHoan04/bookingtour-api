import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([]),
    ActionLogModule,
    FileArchivalModule,
  ],
  exports: [],
  controllers: [],
  providers: [],
})
export class VoucherModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
