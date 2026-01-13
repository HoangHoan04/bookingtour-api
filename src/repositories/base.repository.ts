import { ActionLogEntity, UploadFileEntity } from 'src/entities';
import { ChatHistoryEntity } from 'src/entities/chat-history.entity';
import { TranslationEntity } from 'src/entities/translation.entity';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(ActionLogEntity)
export class ActionLogRepository extends Repository<ActionLogEntity> {}

@CustomRepository(UploadFileEntity)
export class UploadFileRepository extends Repository<UploadFileEntity> {}

@CustomRepository(TranslationEntity)
export class TranslationRepository extends Repository<TranslationEntity> {}

@CustomRepository(ChatHistoryEntity)
export class ChatHistoryRepository extends Repository<ChatHistoryEntity> {}
