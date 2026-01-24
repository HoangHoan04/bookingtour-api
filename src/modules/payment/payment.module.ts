import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';

import { PaymentService } from './payment.service';
import { BookingRepository, PaymentRepository } from 'src/repositories';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([BookingRepository, PaymentRepository]),
    ActionLogModule,
    FileArchivalModule,
  ],
  exports: [PaymentService],
  controllers: [],
  providers: [PaymentService],
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
