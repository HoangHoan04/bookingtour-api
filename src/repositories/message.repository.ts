import { CallLogEntity } from 'src/entities/message/call-logs.entity';
import { CallParticipantEntity } from 'src/entities/message/call-participant.entity';
import { ChatMessageEntity } from 'src/entities/message/chat-messages.entity';
import { ChatRoomMemberEntity } from 'src/entities/message/chat-room-members.entity';
import { ChatRoomEntity } from 'src/entities/message/chat-room.entity';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(ChatMessageEntity)
export class ChatMessageRepository extends Repository<ChatMessageEntity> {}

@CustomRepository(ChatRoomEntity)
export class ChatRoomRepository extends Repository<ChatRoomEntity> {}

@CustomRepository(ChatRoomMemberEntity)
export class ChatRoomMemberRepository extends Repository<ChatRoomMemberEntity> {}

@CustomRepository(CallLogEntity)
export class CallLogRepository extends Repository<CallLogEntity> {}

@CustomRepository(CallParticipantEntity)
export class CallParticipantRepository extends Repository<CallParticipantEntity> {}
