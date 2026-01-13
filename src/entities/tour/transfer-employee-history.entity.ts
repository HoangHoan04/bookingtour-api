import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TransferEmployeeEntity } from './transfer-employee.entity';

@Entity('transfer_employee_history')
export class TransferEmployeeHistoryEntity extends BaseEntity {
  @ApiProperty({ description: 'ID điều chuyển nhân viên' })
  @Column({ type: 'uuid' })
  transferEmployeeId: string;
  @ManyToOne(() => TransferEmployeeEntity, (t) => t.history)
  @JoinColumn({ name: 'transferEmployeeId' })
  transferEmployee: Promise<TransferEmployeeEntity>;

  @ApiProperty({ description: 'Hành động' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  action: string;

  @ApiProperty({ description: 'ID người thực hiện hành động' })
  @Column({ type: 'uuid', nullable: true })
  actorId?: string;

  @ApiProperty({ description: 'Bình luận' })
  @Column({ type: 'text', nullable: true })
  comment?: string;
}
