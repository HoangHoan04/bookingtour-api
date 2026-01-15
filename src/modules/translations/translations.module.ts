import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TranslationRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { TranslationsService } from './translations.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TranslationRepository]),
    ActionLogModule,
  ],
  exports: [TranslationsService],
  controllers: [],
  providers: [TranslationsService],
})
export class TranslationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
