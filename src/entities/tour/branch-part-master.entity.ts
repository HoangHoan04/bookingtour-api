import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BranchEntity } from './branch.entity';
import { PartMasterEntity } from './part-master.entity';

/** Liên kết chi nhánh với bộ phận mẫu */
@Entity('branch_part_master')
export class BranchPartMasterEntity extends BaseEntity {
  @ApiProperty({ description: 'ID chi nhánh' })
  @Column({ type: 'uuid' })
  branchId: string;

  @ApiProperty({ description: 'ID bộ phận master' })
  @Column({ type: 'uuid' })
  partMasterId: string;

  @ManyToOne(() => BranchEntity, (branch) => branch.branchPartMasters)
  @JoinColumn({ name: 'branchId' })
  branch: Promise<BranchEntity>;

  @ManyToOne(() => PartMasterEntity, (pm) => pm.branchPartMasters)
  @JoinColumn({ name: 'partMasterId' })
  partMaster: Promise<PartMasterEntity>;
}
