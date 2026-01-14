import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CustomerEntity } from '../user/customer.entity';
import { BookingDetailEntity } from './booking_detail.entity';
import { ReviewEntity } from './review.entity';

@Entity('bookings')
export class BookingEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã đơn đặt' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @ApiProperty({ description: 'Tên liên hệ' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  contactFullname: string;

  @ApiProperty({ description: 'Email liên hệ' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  contactEmail: string;

  @ApiProperty({ description: 'Số điện thoại liên hệ' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  contactPhone: string;

  @ApiProperty({ description: 'Địa chỉ liên hệ' })
  @Column({ type: 'varchar', length: 250, nullable: false })
  contactAddress: string;

  @ApiProperty({ description: 'Ghi chú đặc biệt từ khách' })
  @Column({ type: 'text', nullable: true })
  note: string;

  @ApiProperty({ description: 'Tổng giá tiền đơn đặt' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  totalPrice?: number;

  @ApiProperty({ description: 'Số tiền giảm giá' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  discountAmount: number;

  @ApiProperty({ description: 'Giá tiền cuối cùng sau khi giảm giá' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  finalPrice: number;

  @ApiProperty({ description: 'Mã voucher đã sử dụng' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  voucherCode: string;

  @ApiProperty({ description: 'Lý do hủy đơn đặt' })
  @Column({ type: 'text', nullable: true })
  cancelReason: string;

  @ApiProperty({ description: 'Ngày hết hạn đơn đặt' })
  @Column({ type: 'timestamp', nullable: true })
  expiredAt: Date;

  @ApiProperty({ description: 'Ngày xác nhận đơn đặt' })
  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @ApiProperty({ description: 'Ngày hoàn thành đơn đặt' })
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @ApiProperty({ description: 'Trạng thái đơn đặt' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @ApiProperty({ description: 'Người hủy đơn đặt' })
  @Column({ type: 'uuid', nullable: true })
  cancelledBy: string;

  @ApiProperty({ description: 'Mã khách hàng đặt tour' })
  @Column({ type: 'uuid', nullable: false })
  customerId: string;
  @ManyToOne(() => CustomerEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ApiProperty({ description: 'Chi tiết đặt chỗ' })
  @OneToMany(() => BookingDetailEntity, (bd) => bd.booking)
  bookingDetails: Promise<BookingDetailEntity[]>;

  @ApiProperty({ description: 'Review của khách hàng' })
  @OneToMany(() => ReviewEntity, (p) => p.booking)
  reviews: Promise<ReviewEntity[]>;
}
