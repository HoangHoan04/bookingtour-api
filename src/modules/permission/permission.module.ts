import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PermissionRepository } from 'src/repositories';
import { TypeOrmExModule } from '../../typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([PermissionRepository]),
    ActionLogModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
