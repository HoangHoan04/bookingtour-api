import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { ChatRoomEntity } from './chat-room.entity';

@Entity('chat_messages')
export class ChatMessageEntity extends BaseEntity {
  @ApiProperty({ description: 'ID phòng chat' })
  @Column({ type: 'uuid' })
  chatRoomId: string;

  @ManyToOne(() => ChatRoomEntity, (r) => r.messages)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoomEntity;

  @ApiProperty({ description: 'Người gửi' })
  @Column({ type: 'uuid' })
  senderId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'senderId' })
  sender: UserEntity;

  @ApiProperty({ description: 'Nội dung tin nhắn' })
  @Column({ type: 'text', nullable: true })
  content: string;

  @ApiProperty({
    description: 'Loại: TEXT, IMAGE, FILE, AUDIO, VIDEO, CALL_LOG',
  })
  @Column({ type: 'varchar', length: 20, default: 'TEXT' })
  messageType: string;

  @ApiProperty({ description: 'File đính kèm (JSON array)' })
  @Column({ type: 'jsonb', nullable: true })
  attachments: any;

  @ApiProperty({ description: 'Tin nhắn trả lời (reply)' })
  @Column({ type: 'uuid', nullable: true })
  replyToMessageId: string;

  @ManyToOne(() => ChatMessageEntity)
  @JoinColumn({ name: 'replyToMessageId' })
  replyToMessage: ChatMessageEntity;

  @ApiProperty({ description: 'Đã được chỉnh sửa?' })
  @Column({ type: 'boolean', default: false })
  isEdited: boolean;

  @ApiProperty({ description: 'Thời gian chỉnh sửa' })
  @Column({ type: 'timestamp', nullable: true })
  editedAt: Date;
}
