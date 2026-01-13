import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DepartmentRepository } from 'src/repositories/hr.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([DepartmentRepository]),
    ActionLogModule,
  ],
  exports: [DepartmentService],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
