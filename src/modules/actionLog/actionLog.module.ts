import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ActionLogRepository } from 'src/repositories/base.repository';
import { TypeOrmExModule } from '../../typeorm';
import { ActionLogController } from './actionLog.controller';
import { ActionLogService } from './actionLog.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ActionLogRepository])],
  controllers: [ActionLogController],
  providers: [ActionLogService],
  exports: [ActionLogService],
})
export class ActionLogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
