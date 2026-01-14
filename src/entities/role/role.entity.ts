import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserRoleEntity } from './user_role.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã vai trò (ADMIN, MANAGER, STAFF, CUSTOMER)' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên vai trò' })
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @ApiProperty({ description: 'Mô tả' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Danh sách quyền hạn (array of permission codes)',
  })
  @Column({ type: 'json', nullable: true })
  permissions?: string[];

  @ApiProperty({ description: 'Trạng thái vai trò' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRoles: UserRoleEntity[];
}
