import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  BranchPartMasterRepository,
  BranchRepository,
} from 'src/repositories/hr.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BranchRepository,
      BranchPartMasterRepository,
    ]),
    ActionLogModule,
  ],
  exports: [BranchService],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
