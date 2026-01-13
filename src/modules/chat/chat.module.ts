import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from 'src/common/gateway/chat.gateway';
import {
  CallLogRepository,
  CallParticipantRepository,
  ChatMessageRepository,
  ChatRoomMemberRepository,
  ChatRoomRepository,
  EmployeeRepository,
} from 'src/repositories';
import { TypeOrmExModule } from 'src/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ChatRoomRepository,
      ChatRoomMemberRepository,
      ChatMessageRepository,
      CallLogRepository,
      CallParticipantRepository,
      EmployeeRepository,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
