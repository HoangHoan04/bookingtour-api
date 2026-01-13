import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from './role.entity';

@Entity('user_roles')
export class UserRoleEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã người dùng' })
  @Column({ type: 'uuid' })
  userId: string;

  @ApiProperty({ description: 'Mã vai trò' })
  @Column({ type: 'uuid' })
  roleId: string;

  @ApiProperty({ description: 'Ngày gán vai trò' })
  @Column({ type: 'timestamptz', default: () => 'CURRENT_DATE' })
  assignedDate: Date;

  @ApiProperty({ description: 'Mã người gán vai trò' })
  @Column({ type: 'uuid', nullable: true })
  assignedById: string;

  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'assignedById' })
  assignedBy: UserEntity;
}
