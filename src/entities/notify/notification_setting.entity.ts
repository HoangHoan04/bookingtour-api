import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CustomerEntity } from '../user/customer.entity';

@Entity('notification_settings')
export class NotificationSettingEntity extends BaseEntity {
  @ApiProperty({ description: 'Liên kết 1-1 với customer' })
  @Column({
    type: 'uuid',
    unique: true,
    nullable: false,
    comment: 'Liên kết 1-1 với users',
  })
  customerId: string;
  @OneToOne(() => CustomerEntity, (customer) => customer.notificationSetting)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ApiProperty({ description: 'Nhận thông báo qua email', default: true })
  @Column({ type: 'boolean', default: 1, comment: 'Nhận thông báo qua email' })
  emailNotifications: boolean;

  @ApiProperty({ description: 'Nhận push notification', default: true })
  @Column({ type: 'boolean', default: 1, comment: 'Nhận push notification' })
  pushNotifications: boolean;

  @ApiProperty({ description: 'Nhận thông báo qua SMS', default: false })
  @Column({ type: 'boolean', default: 0, comment: 'Nhận thông báo qua SMS' })
  smsNotifications: boolean;

  @ApiProperty({ description: 'Nhận thông báo khuyến mãi', default: true })
  @Column({ type: 'boolean', default: 1, comment: 'Nhận thông báo khuyến mãi' })
  promotionNotifications: boolean;

  @ApiProperty({ description: 'Nhận thông báo đặt tour', default: true })
  @Column({ type: 'boolean', default: 1, comment: 'Nhận thông báo đặt tour' })
  bookingNotifications: boolean;

  @ApiProperty({ description: 'Nhận gợi ý tour', default: true })
  @Column({ type: 'boolean', default: 1, comment: 'Nhận gợi ý tour' })
  recommendationNotifications: boolean;
}
