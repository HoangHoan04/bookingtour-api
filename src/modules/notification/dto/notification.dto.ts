export class NotificationCreateDto {
  lstUserId?: string[];
  title: string;
  content: string;
  notificationType?: string;
  relatedEntity?: string;
  relatedId?: string;
  priority?: string;
  actionUrl?: string;
  expiresAt?: Date;
}

export class NotificationCreateAdminDto {
  title: string;
  content: string;
  notificationType?: string;
  relatedEntity?: string;
  relatedId?: string;
  priority?: string;
  actionUrl?: string;
  expiresAt?: Date;
}

export class UpdateNotificationSettingDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  promotionNotifications?: boolean;
  bookingNotifications?: boolean;
  recommendationNotifications?: boolean;
}
