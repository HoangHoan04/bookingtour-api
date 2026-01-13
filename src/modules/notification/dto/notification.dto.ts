import { NotificationEntity } from 'src/entities';

export class NotificationCreateDto {
  lstEmployeeId?: string[];
  lstUserId?: string[];
  title: string;
  content: string;
  type?: string;
  priority?: string;
  targetAudience?: string;
  classId?: string;
  expiryDate?: Date;
  attachments?: string;
}

export class NotificationCreateAdminDto {
  title: string;
  content: string;
  type?: string;
  priority?: string;
  targetAudience?: string;
  classId?: string;
  expiryDate?: Date;
  attachments?: string;
}

export class NotificationWithRecipient extends NotificationEntity {
  isRead?: boolean;
  readAt?: Date;
}
