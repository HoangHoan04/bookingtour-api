import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { DepartmentEntity } from './department.entity';

/** Loại phòng ban */
@Entity('department_type')
export class DepartmentTypeEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã loại phòng ban' })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ApiProperty({ description: 'Tên loại phòng ban ' })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết ' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @ApiProperty({ description: 'Danh sách phòng ban' })
  @OneToMany(() => DepartmentEntity, (department) => department.departmentType)
  departments: Promise<DepartmentEntity[]>;
}
