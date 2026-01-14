import { NotificationEntity, NotificationSettingEntity } from 'src/entities';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {}

@CustomRepository(NotificationSettingEntity)
export class NotificationSettingRepository extends Repository<NotificationSettingEntity> {}
