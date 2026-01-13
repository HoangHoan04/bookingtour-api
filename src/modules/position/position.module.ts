import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PositionRepository } from 'src/repositories/hr.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PositionRepository]),
    ActionLogModule,
  ],
  exports: [PositionService],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
