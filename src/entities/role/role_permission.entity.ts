import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { enumData } from '../../constants';
import { BaseEntity } from '../base.entity';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity('role_permissions')
export class RolePermissionEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã vai trò' })
  @Column({ type: 'uuid' })
  roleId: string;

  @ApiProperty({ description: 'Mã quyền' })
  @Column({ type: 'uuid' })
  permissionId: string;

  @ApiProperty({
    description: 'Phạm vi truy cập dữ liệu: ALL, BRANCH, DEPARTMENT, OWN',
    enum: enumData.DataScope,
  })
  @Column({
    type: 'varchar',
    length: 20,
  })
  scope: string;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(
    () => PermissionEntity,
    (permission) => permission.rolePermissions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;
}
