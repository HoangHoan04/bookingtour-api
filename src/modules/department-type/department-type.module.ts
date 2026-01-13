import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DepartmentTypeRepository } from 'src/repositories/hr.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { DepartmentTypeController } from './department-type.controller';
import { DepartmentTypeService } from './department-type.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([DepartmentTypeRepository]),
    ActionLogModule,
  ],
  exports: [DepartmentTypeService],
  controllers: [DepartmentTypeController],
  providers: [DepartmentTypeService],
})
export class DepartmentTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
