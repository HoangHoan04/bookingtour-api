import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { BranchModule } from './modules/branch/branch.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { CompanyModule } from './modules/company/company.module';
import { DepartmentTypeModule } from './modules/department-type/department-type.module';
import { DepartmentModule } from './modules/department/department.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { FileArchivalModule } from './modules/fileArchival/fileArchival.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PartMasterModule } from './modules/part-master/part-master.module';
import { PartModule } from './modules/part/part.module';
import { PermissionModule } from './modules/permission/permission.module';
import { PositionMasterModule } from './modules/position-master/position-master.module';
import { PositionModule } from './modules/position/position.module';
import { RoleModule } from './modules/role/role.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { UploadFileModule } from './modules/uploadFile/uploadFile.module';
import { TypeOrmExModule } from './typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    CacheModule.register(),
    DatabaseModule,
    TypeOrmExModule,
    AuthModule,
    EmployeeModule,
    BranchModule,
    CompanyModule,
    FileArchivalModule,
    NotificationModule,
    RoleModule,
    PermissionModule,
    DepartmentTypeModule,
    DepartmentModule,
    PartModule,
    PartMasterModule,
    PositionModule,
    PositionMasterModule,
    UploadFileModule,
    TranslationsModule,
    ChatbotModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
