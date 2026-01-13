import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { CallLogEntity } from './call-logs.entity';

@Entity('call_participants')
export class CallParticipantEntity extends BaseEntity {
  @ApiProperty({ description: 'ID cuộc gọi' })
  @Column({ type: 'uuid' })
  callLogId: string;

  @ManyToOne(() => CallLogEntity, (c) => c.participants)
  @JoinColumn({ name: 'callLogId' })
  callLog: CallLogEntity;

  @ApiProperty({ description: 'ID người dùng' })
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiProperty({ description: 'Thời gian tham gia' })
  @Column({ type: 'timestamp', nullable: true })
  joinedAt: Date;

  @ApiProperty({ description: 'Thời gian rời đi' })
  @Column({ type: 'timestamp', nullable: true })
  leftAt: Date;

  @ApiProperty({ description: 'Trạng thái: ANSWERED, MISSED, REJECTED' })
  @Column({ type: 'varchar', length: 20 })
  status: string;
}
