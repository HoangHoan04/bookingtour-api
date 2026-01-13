import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('chat_history')
export class ChatHistoryEntity extends BaseEntity {
  @ApiProperty({ description: 'người dùng' })
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ApiProperty({ description: 'câu hỏi của người dùng' })
  @Column({ type: 'text', nullable: false })
  question: string;

  @ApiProperty({ description: 'câu trả lời của chatbot' })
  @Column({ type: 'text', nullable: false })
  answer: string;
}
