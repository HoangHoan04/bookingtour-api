import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UploadFileRepository } from 'src/repositories';
import { CompanyRepository } from 'src/repositories/hr.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      CompanyRepository,
      UploadFileRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
  ],
  exports: [CompanyService],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
