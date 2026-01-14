import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ChildModule } from 'src/common/decorators/module.decorator';
import { VerifyOtpRepository } from 'src/repositories';
import { SettingStringRepository } from 'src/repositories/base.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { ZaloService } from './zalo.service';

@ChildModule({
  providers: [ZaloService],
  controllers: [],
  imports: [
    TypeOrmExModule.forCustomRepository([
      VerifyOtpRepository,
      SettingStringRepository,
    ]),
    HttpModule,
    ActionLogModule,
  ],
  exports: [ZaloService],
})
export class ZaloModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
