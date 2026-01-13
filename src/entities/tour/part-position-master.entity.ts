import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PartMasterEntity } from './part-master.entity';
import { PositionMasterEntity } from './position-master.entity';

/** Liên kết bộ phận mẫu với vị trí mẫu */
@Entity('part_master_position_master')
export class PartMasterPositionMasterEntity extends BaseEntity {
  @ApiProperty({ description: 'ID bộ phận' })
  @Column({ type: 'uuid' })
  partMasterId: string;

  @ApiProperty({ description: 'ID vị trí' })
  @Column({ type: 'uuid' })
  positionMasterId: string;

  @ManyToOne(() => PartMasterEntity, (pm) => pm.partMasterPositions)
  @JoinColumn({ name: 'partMasterId' })
  partMaster: Promise<PartMasterEntity>;

  @ManyToOne(() => PositionMasterEntity, (pos) => pos.partMasterPositions)
  @JoinColumn({ name: 'positionMasterId' })
  positionMaster: Promise<PositionMasterEntity>;
}
