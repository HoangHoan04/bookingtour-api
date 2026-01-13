import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolePermissionEntity, UserRoleEntity } from '..';
import { BaseEntity } from '../base.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên vai trò' })
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @ApiProperty({ description: 'Mã vai trò (ADMIN, MANAGER, STAFF)' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @ApiProperty({ description: 'Mô tả' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Là role hệ thống (Không được xóa/sửa code)' })
  @Column({ type: 'boolean', default: false })
  isSystem: boolean;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRoles: UserRoleEntity[];

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.role,
  )
  rolePermissions: RolePermissionEntity[];
}
