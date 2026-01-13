import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChatHistoryRepository } from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { DynamicQueryService, SchemaDiscoveryService } from './services';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmExModule.forCustomRepository([ChatHistoryRepository]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, SchemaDiscoveryService, DynamicQueryService],
  exports: [ChatbotService],
})
export class ChatbotModule {}
