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
import { UserRoleEntity } from '../role';
import { CustomerEntity } from './customer.entity';
import { TourGuideEntity } from './tour_guide.entity';

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

  @ApiProperty({ description: 'Mã khách hàng (nếu user là khách hàng)' })
  @Column({ type: 'uuid', nullable: true })
  customerId?: string;
  @OneToOne(() => CustomerEntity, (customer) => customer.user)
  @JoinColumn({ name: 'customerId' })
  customer?: CustomerEntity;

  @ApiProperty({
    description: 'Mã hướng dẫn viên (nếu user là hướng dẫn viên)',
  })
  @Column({ type: 'uuid', nullable: true })
  tourGuideId?: string;
  @OneToOne(() => TourGuideEntity, (tourGuide) => tourGuide.user)
  @JoinColumn({ name: 'tourGuideId' })
  tourGuide?: TourGuideEntity;

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

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];

  @ApiProperty({ description: 'Zalo ID nếu đăng nhập bằng Zalo' })
  @Column({ nullable: true })
  zaloId?: string;

  @ApiProperty({ description: 'Google ID nếu đăng nhập bằng Google' })
  @Column({ nullable: true })
  googleId?: string;

  @ApiProperty({ description: 'Facebook ID nếu đăng nhập bằng Facebook' })
  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  facebookId?: string;

  @ApiProperty({ description: 'Nhà cung cấp đăng nhập (LOCAL, ZALO, GOOGLE)' })
  @Column({ nullable: true })
  loginProvider?: string;

  @ApiProperty({ description: 'Tài khoản đã được xác minh hay chưa' })
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

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
