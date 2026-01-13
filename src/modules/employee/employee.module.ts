import { Module } from '@nestjs/common';
import {
  EmployeeCertificateRepository,
  EmployeeEducationRepository,
  EmployeeRepository,
  RoleRepository,
  UploadFileRepository,
  UserRepository,
  UserRoleRepository,
} from '../../repositories';
import { TypeOrmExModule } from '../../typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      EmployeeRepository,
      EmployeeCertificateRepository,
      EmployeeEducationRepository,
      UserRepository,
      RoleRepository,
      UserRoleRepository,
      UploadFileRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
