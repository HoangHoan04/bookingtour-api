import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DestinationRepository } from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { DestinationService } from './destination.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([DestinationRepository]),
    ActionLogModule,
  ],
  exports: [DestinationService],
  controllers: [],
  providers: [DestinationService],
})
export class DestinationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
