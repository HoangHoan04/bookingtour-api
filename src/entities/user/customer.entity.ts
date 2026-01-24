import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BlogCommentEntity } from '../blogs';
import { FileArchivalEntity } from '../file_archival.entity';
import { NotificationEntity, NotificationSettingEntity } from '../notify';
import { BookingEntity, ReviewEntity, UserVoucherEntity } from '../tours';
import { UserEntity } from './user.entity';

/** Khách hàng */
@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã Khách hàng' })
  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  code: string;

  @ApiProperty({ description: 'Họ tên khách hàng' })
  @Column({ type: 'varchar', length: 30, nullable: false })
  name: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @Column({ type: 'varchar', length: 25, nullable: false })
  phone: string;

  @ApiProperty({ description: 'Email' })
  @Column({ type: 'varchar', length: 250, nullable: false, unique: true })
  email: string;

  @ApiProperty({ description: 'Địa chỉ' })
  @Column({ type: 'varchar', length: 250, nullable: true })
  address?: string;

  @ApiProperty({ description: 'Giới tính (MALE, FEMALE)' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  gender?: string;

  @ApiProperty({ description: 'Ngày sinh' })
  @Column({ type: 'timestamptz', nullable: false })
  birthday: Date;

  @ApiProperty({ description: 'Quốc tịch' })
  @Column({ type: 'varchar', length: 12, nullable: true })
  nationality?: string;

  @ApiProperty({ description: 'Số căn cước công dân/CMND' })
  @Column({ type: 'varchar', length: 12, nullable: true, unique: true })
  identityCard?: string;

  @ApiProperty({ description: 'Số hộ chiếu' })
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  passportNumber?: string;

  @ApiProperty({ description: 'Trạng thái Khách hàng' })
  @Column({
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  status?: string;

  @ApiProperty({ description: 'Ghi chú' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Ảnh đại diện' })
  @OneToMany(() => FileArchivalEntity, (p) => p.customer)
  avatar: Promise<FileArchivalEntity[]>;

  @ApiProperty({ description: 'Tài khoản người dùng' })
  @OneToOne(() => UserEntity, (user) => user.customer)
  user: Promise<UserEntity>;

  @ApiProperty({ description: 'Booking của khách hàng' })
  @OneToMany(() => BookingEntity, (booking) => booking.customer)
  bookings: Promise<BookingEntity[]>;

  @ApiProperty({ description: 'Review của khách hàng' })
  @OneToMany(() => ReviewEntity, (p) => p.customer)
  reviews: Promise<ReviewEntity[]>;

  @ApiProperty({ description: 'Voucher của khách hàng' })
  @OneToMany(() => UserVoucherEntity, (p) => p.customer)
  vouchers: Promise<UserVoucherEntity[]>;

  @ApiProperty({ description: 'Thông báo của khách hàng' })
  @OneToMany(() => NotificationEntity, (p) => p.customer)
  notifications: Promise<NotificationEntity[]>;

  @ApiProperty({ description: 'Cài đặt thông báo của khách hàng' })
  @OneToOne(() => NotificationSettingEntity, (p) => p.customer)
  notificationSetting: Promise<NotificationSettingEntity>;

  @ApiProperty({ description: 'Comment của khách hàng' })
  @OneToMany(() => BlogCommentEntity, (p) => p.customer)
  blogComments: Promise<BlogCommentEntity[]>;
}
