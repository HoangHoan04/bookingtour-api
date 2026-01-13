import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BranchPartMasterEntity } from './branch-part-master.entity';
import { PartMasterPositionMasterEntity } from './part-position-master.entity';
import { PartEntity } from './part.entity';

/** Cấu hình bộ phận master */
@Entity('part_master')
export class PartMasterEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã bộ phận master' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên bộ phận master' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty({ description: 'Mô tả bộ phận master - Ghi chú' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Danh sách cấu hình bộ phận master của chi nhánh',
  })
  @OneToMany(() => BranchPartMasterEntity, (bpm) => bpm.partMaster)
  branchPartMasters: Promise<BranchPartMasterEntity[]>;

  @ApiProperty({ description: 'Danh sách vị trí liên kết với bộ phận master' })
  @OneToMany(() => PartMasterPositionMasterEntity, (pmp) => pmp.partMaster)
  partMasterPositions: Promise<PartMasterPositionMasterEntity[]>;

  @ApiProperty({ description: 'Danh sách bộ phận' })
  @OneToMany(() => PartEntity, (p) => p.partMaster)
  parts: Promise<PartEntity[]>;
}
