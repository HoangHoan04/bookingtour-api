import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BookingRepository, PaymentRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { PaymentService } from './payment.service';

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
