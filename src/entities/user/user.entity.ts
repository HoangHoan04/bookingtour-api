import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { EmployeeEntity } from '../tour/employee.entity';
import { UserRoleEntity } from '../role/user_role.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ description: 'Tên đăng nhập' })
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @ApiProperty({ description: 'Mật khẩu đã mã hóa' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'Email' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Mã nhân viên (nếu user là nhân viên)' })
  @Column({ type: 'uuid', nullable: true })
  employeeId: string;

  @ApiProperty({ description: 'Tài khoản có đang hoạt động không' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Tài khoản có là admin không' })
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty({ description: 'Refresh token đã mã hóa' })
  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @ApiProperty({ description: 'Lần đăng nhập gần nhất' })
  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @OneToOne(() => EmployeeEntity, (employee) => employee.user)
  @JoinColumn({ name: 'employeeId' })
  employee: EmployeeEntity;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.password);
  }
}
