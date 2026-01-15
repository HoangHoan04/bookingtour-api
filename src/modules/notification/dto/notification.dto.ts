import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

// Enums cho notification
export enum NotificationType {
  SYSTEM = 'system',
  BOOKING = 'booking',
  PAYMENT = 'payment',
  PROMOTION = 'promotion',
  GENERAL = 'general',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum RelatedEntityType {
  BOOKING = 'booking',
  PAYMENT = 'payment',
  TOUR = 'tour',
  USER = 'user',
}

// DTO để tạo notification (dùng cho admin gửi cho user cụ thể)
export class NotificationCreateDto {
  @ApiProperty({
    description:
      'Danh sách user ID nhận thông báo (nếu không truyền sẽ gửi cho tất cả)',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  lstUserId?: string[];

  @ApiProperty({
    description: 'Tiêu đề thông báo',
    example: 'Thông báo quan trọng',
  })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Nội dung thông báo',
    example: 'Đây là nội dung thông báo',
  })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Loại thông báo',
    enum: NotificationType,
    default: NotificationType.GENERAL,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  notificationType?: NotificationType;

  @ApiProperty({
    description: 'Loại entity liên quan',
    enum: RelatedEntityType,
    required: false,
  })
  @IsOptional()
  @IsEnum(RelatedEntityType)
  relatedEntity?: RelatedEntityType;

  @ApiProperty({ description: 'ID của entity liên quan', required: false })
  @IsOptional()
  @IsUUID('4')
  relatedId?: string;

  @ApiProperty({
    description: 'Độ ưu tiên',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiProperty({ description: 'Link hành động', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  actionUrl?: string;

  @ApiProperty({ description: 'Thời gian hết hạn', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @ApiProperty({ description: 'Icon của thông báo', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @ApiProperty({ description: 'Màu sắc của thông báo', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;
}

// DTO để admin tạo thông báo gửi cho admin khác
export class NotificationCreateAdminDto {
  @ApiProperty({ description: 'Tiêu đề thông báo' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Loại thông báo',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  notificationType?: NotificationType;

  @ApiProperty({
    description: 'Loại entity liên quan',
    enum: RelatedEntityType,
    required: false,
  })
  @IsOptional()
  @IsEnum(RelatedEntityType)
  relatedEntity?: RelatedEntityType;

  @ApiProperty({ description: 'ID của entity liên quan', required: false })
  @IsOptional()
  @IsUUID('4')
  relatedId?: string;

  @ApiProperty({
    description: 'Độ ưu tiên',
    enum: NotificationPriority,
    default: NotificationPriority.HIGH,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiProperty({ description: 'Link hành động', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  actionUrl?: string;

  @ApiProperty({ description: 'Thời gian hết hạn', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @ApiProperty({ description: 'Icon của thông báo', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @ApiProperty({ description: 'Màu sắc của thông báo', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;
}

// DTO để cập nhật notification setting
export class UpdateNotificationSettingDto {
  @ApiProperty({ description: 'Nhận thông báo qua email', required: false })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ description: 'Nhận push notification', required: false })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiProperty({ description: 'Nhận thông báo qua SMS', required: false })
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @ApiProperty({ description: 'Nhận thông báo khuyến mãi', required: false })
  @IsOptional()
  @IsBoolean()
  promotionNotifications?: boolean;

  @ApiProperty({ description: 'Nhận thông báo đặt tour', required: false })
  @IsOptional()
  @IsBoolean()
  bookingNotifications?: boolean;

  @ApiProperty({ description: 'Nhận gợi ý tour', required: false })
  @IsOptional()
  @IsBoolean()
  recommendationNotifications?: boolean;
}

// DTO để update notification
export class UpdateNotificationDto {
  @ApiProperty({ description: 'Tiêu đề thông báo', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({ description: 'Nội dung thông báo', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Loại thông báo',
    enum: NotificationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  notificationType?: NotificationType;

  @ApiProperty({
    description: 'Độ ưu tiên',
    enum: NotificationPriority,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiProperty({ description: 'Link hành động', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  actionUrl?: string;

  @ApiProperty({ description: 'Icon của thông báo', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;

  @ApiProperty({ description: 'Màu sắc của thông báo', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;
}

// DTO để đánh dấu đã đọc danh sách notification
export class MarkReadListDto {
  @ApiProperty({ description: 'Danh sách ID notification', type: [String] })
  @IsNotEmpty({ message: 'Danh sách ID không được để trống' })
  @IsArray()
  @IsUUID('4', { each: true })
  lstId: string[];
}
