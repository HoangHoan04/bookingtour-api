import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { NotificationRecipientEntity } from './notification_recipient.entity';

@Entity('notifications')
export class NotificationEntity extends BaseEntity {
  @ApiProperty({ description: 'Tiêu đề thông báo' })
  @Column({ type: 'varchar', length: 500 })
  title: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Loại: công văn, thông báo, khẩn cấp, nhắc nhở' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @ApiProperty({ description: 'Độ ưu tiên: low, normal, high, urgent' })
  @Column({ type: 'varchar', length: 20, default: 'normal' })
  priority: string;

  @ApiProperty({ description: 'Mã người gửi' })
  @Column({ type: 'uuid', nullable: true })
  senderId: string;

  @ApiProperty({
    description: 'Đối tượng nhận: all, employees, parents, specific-class',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  targetAudience: string;

  @ApiProperty({ description: 'Mã lớp (nếu gửi cho lớp cụ thể)' })
  @Column({ type: 'uuid', nullable: true })
  classId?: string;

  @ApiProperty({ description: 'Thời gian xuất bản' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishDate: Date;

  @ApiProperty({ description: 'Thời gian hết hạn' })
  @Column({ type: 'timestamp', nullable: true })
  expiryDate?: Date;

  @ApiProperty({ description: 'Trạng thái: draft, published, expired' })
  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string;

  @ApiProperty({ description: 'Danh sách file đính kèm (JSON)' })
  @Column({ type: 'text', nullable: true })
  attachments?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'senderId' })
  sender: UserEntity;

  @OneToMany(
    () => NotificationRecipientEntity,
    (recipient) => recipient.notification,
  )
  recipients: NotificationRecipientEntity[];
}
