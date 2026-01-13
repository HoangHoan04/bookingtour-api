import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { ChatRoomEntity } from './chat-room.entity';

@Entity('chat_room_members')
export class ChatRoomMemberEntity extends BaseEntity {
  @ApiProperty({ description: 'ID phòng chat' })
  @Column({ type: 'uuid' })
  chatRoomId: string;

  @ManyToOne(() => ChatRoomEntity, (r) => r.members)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoomEntity;

  @ApiProperty({ description: 'ID người dùng' })
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({ description: 'Vai trò: ADMIN, MEMBER' })
  @Column({ type: 'varchar', length: 20, default: 'MEMBER' })
  role: string;

  @ApiProperty({ description: 'Thời gian đọc tin nhắn cuối' })
  @Column({ type: 'timestamp', nullable: true })
  lastReadAt: Date;

  @ApiProperty({ description: 'Đã tắt thông báo?' })
  @Column({ type: 'boolean', default: false })
  isMuted: boolean;

  @ApiProperty({ description: 'Đã rời khỏi phòng?' })
  @Column({ type: 'boolean', default: false })
  hasLeft: boolean;
}
