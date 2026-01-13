import { NotificationEntity, NotificationRecipientEntity } from 'src/entities';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {}

@CustomRepository(NotificationRecipientEntity)
export class NotificationRecipientRepository extends Repository<NotificationRecipientEntity> {}
