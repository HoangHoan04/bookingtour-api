import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PositionMasterRepository } from 'src/repositories/hr.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { PositionMasterController } from './position-master.controller';
import { PositionMasterService } from './position-master.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PositionMasterRepository]),
    ActionLogModule,
  ],
  exports: [PositionMasterService],
  controllers: [PositionMasterController],
  providers: [PositionMasterService],
})
export class PositionMasterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
