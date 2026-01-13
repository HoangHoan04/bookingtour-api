import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { ChatMessageEntity } from './chat-messages.entity';
import { ChatRoomMemberEntity } from './chat-room-members.entity';

@Entity('chat_rooms')
export class ChatRoomEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên phòng chat' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ApiProperty({ description: 'Loại phòng: DIRECT (1-1), GROUP (nhóm)' })
  @Column({ type: 'varchar', length: 20, default: 'DIRECT' })
  type: string;

  @ApiProperty({ description: 'Avatar nhóm (nếu là GROUP)' })
  @Column({ type: 'text', nullable: true })
  avatarUrl: string;

  @ApiProperty({ description: 'Người tạo phòng' })
  @Column({ type: 'uuid' })
  createdByUserId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: UserEntity;

  @OneToMany(() => ChatRoomMemberEntity, (m) => m.chatRoom)
  members: ChatRoomMemberEntity[];

  @OneToMany(() => ChatMessageEntity, (m) => m.chatRoom)
  messages: ChatMessageEntity[];
}
