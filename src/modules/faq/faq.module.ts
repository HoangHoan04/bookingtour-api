import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FaqRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FaqService } from './faq.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FaqRepository]),
    ActionLogModule,
  ],
  exports: [FaqService],
  controllers: [],
  providers: [FaqService],
})
export class FaqModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
