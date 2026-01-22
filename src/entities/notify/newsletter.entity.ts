import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('newsletter')
export class NewsletterEntity extends BaseEntity {
  @ApiProperty({ description: 'Email đăng ký nhận tin' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index({ unique: true })
  email: string;

  @ApiProperty({ description: 'Trạng thái kích hoạt' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Ngày đăng ký' })
  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  subscribedAt: Date;

  @ApiProperty({ description: 'Ngày hủy đăng ký' })
  @Column({ type: 'timestamp', nullable: true, default: null })
  unsubscribedAt: Date | null;
}
