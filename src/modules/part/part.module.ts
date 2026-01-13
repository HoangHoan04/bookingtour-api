import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PartRepository } from 'src/repositories/hr.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { PartController } from './part.controller';
import { PartService } from './part.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PartRepository]),
    ActionLogModule,
  ],
  exports: [PartService],
  controllers: [PartController],
  providers: [PartService],
})
export class PartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
