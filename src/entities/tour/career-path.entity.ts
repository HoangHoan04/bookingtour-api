import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PositionMasterEntity } from './position-master.entity';

/** Lộ trình thăng tiến */
@Entity('career_path')
export class CareerPathEntity extends BaseEntity {
  @ApiProperty({ description: 'ID vị trí hiện tại' })
  @Column({ type: 'uuid' })
  currentPositionId: string;

  @ApiProperty({ description: 'ID vị trí tiếp theo' })
  @Column({ type: 'uuid' })
  nextPositionId: string;

  @ApiProperty({ description: 'Số tháng kinh nghiệm tối thiểu' })
  @Column({ type: 'int', nullable: true })
  minMonthExperience: number;

  @ManyToOne(() => PositionMasterEntity, (p) => p.nextCareers)
  @JoinColumn({ name: 'currentPositionId' })
  currentPosition: Promise<PositionMasterEntity>;

  @ManyToOne(() => PositionMasterEntity, (p) => p.previousCareers)
  @JoinColumn({ name: 'nextPositionId' })
  nextPosition: Promise<PositionMasterEntity>;
}
