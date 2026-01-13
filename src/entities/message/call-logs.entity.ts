import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { CallParticipantEntity } from './call-participant.entity';
import { ChatRoomEntity } from './chat-room.entity';

@Entity('call_logs')
export class CallLogEntity extends BaseEntity {
  @ApiProperty({ description: 'ID phòng chat' })
  @Column({ type: 'uuid' })
  chatRoomId: string;

  @ManyToOne(() => ChatRoomEntity)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: ChatRoomEntity;

  @ApiProperty({ description: 'Người khởi tạo cuộc gọi' })
  @Column({ type: 'uuid' })
  callerId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'callerId' })
  caller: UserEntity;

  @ApiProperty({ description: 'Loại cuộc gọi: AUDIO, VIDEO' })
  @Column({ type: 'varchar', length: 20 })
  callType: string;

  @ApiProperty({
    description: 'Trạng thái: RINGING, ONGOING, ENDED, MISSED, REJECTED',
  })
  @Column({ type: 'varchar', length: 20 })
  status: string;

  @ApiProperty({ description: 'Thời gian bắt đầu' })
  @Column({ type: 'timestamp' })
  startedAt: Date;

  @ApiProperty({ description: 'Thời gian kết thúc' })
  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date;

  @ApiProperty({ description: 'Thời lượng (giây)' })
  @Column({ type: 'int', default: 0 })
  duration: number;

  @OneToMany(() => CallParticipantEntity, (p) => p.callLog)
  participants: CallParticipantEntity[];
}
