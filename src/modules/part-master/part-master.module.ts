import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  BranchPartMasterRepository,
  PartMasterRepository,
} from 'src/repositories/hr.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { PartMasterController } from './part-master.controller';
import { PartMasterService } from './part-master.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      PartMasterRepository,
      BranchPartMasterRepository,
    ]),
    ActionLogModule,
  ],
  exports: [PartMasterService],
  controllers: [PartMasterController],
  providers: [PartMasterService],
})
export class PartMasterModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
