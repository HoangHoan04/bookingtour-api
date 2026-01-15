import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CustomerEntity } from '../user/customer.entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @ApiProperty({ description: 'Người nhận thông báo' })
  @Column({ type: 'uuid', nullable: false })
  customerId: string;
  @ManyToOne(() => CustomerEntity, (customer) => customer.notifications)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ApiProperty({ description: 'Tiêu đề thông báo' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiProperty({ description: 'Nội dung chi tiết' })
  @Column({ type: 'text', nullable: true })
  content: string;

  @ApiProperty({
    description: 'Loại thông báo (system/booking/payment/promotion/general)',
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'general',
  })
  notificationType: string;

  @ApiProperty({
    description: 'Loại entity liên quan (booking/payment/tour...)',
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  relatedEntity: string;

  @ApiProperty({ description: 'ID của entity liên quan' })
  @Column({ type: 'uuid', nullable: true })
  relatedId: string;

  @ApiProperty({ description: 'Đã đọc chưa' })
  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ApiProperty({ description: 'Thời gian đọc' })
  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @ApiProperty({ description: 'Độ ưu tiên (low/normal/high/urgent)' })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'normal',
  })
  priority: string;

  @ApiProperty({ description: 'Link hành động (deep link)' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  actionUrl: string;

  @ApiProperty({ description: 'Thời gian hết hạn' })
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ApiProperty({ description: 'Icon của thông báo' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  icon: string;

  @ApiProperty({ description: 'Màu sắc của thông báo' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;
}
