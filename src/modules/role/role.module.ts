import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RoleRepository, UserRoleRepository } from 'src/repositories';
import { TypeOrmExModule } from '../../typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([RoleRepository, UserRoleRepository]),
    ActionLogModule,
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
