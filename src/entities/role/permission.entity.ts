import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { RolePermissionEntity } from './role_permission.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên quyền (Hiển thị UI)' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Mã quyền (Dùng trong code: PRODUCT:VIEW)' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @ApiProperty({ description: 'Module chức năng (Product, User, Order...)' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  module: string;

  @ApiProperty({ description: 'Mô tả' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.permission)
  rolePermissions: RolePermissionEntity[];
}
