import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { NotificationEntity } from './notification.entity';

@Entity('notification_recipients')
export class NotificationRecipientEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã thông báo' })
  @Column({ type: 'uuid' })
  notificationId: string;

  @ApiProperty({ description: 'Mã người nhận' })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Đã đọc chưa' })
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ApiProperty({ description: 'Thời gian đọc' })
  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @ManyToOne(
    () => NotificationEntity,
    (notification) => notification.recipients,
  )
  @JoinColumn({ name: 'notificationId' })
  notification: NotificationEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
