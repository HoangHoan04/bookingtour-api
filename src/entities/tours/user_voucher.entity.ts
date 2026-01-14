import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CustomerEntity } from '../user/customer.entity';
import { VoucherEntity } from './voucher.entity';

@Entity('user_vouchers')
export class UserVoucherEntity extends BaseEntity {
  @ApiProperty({ description: 'Người sở hữu voucher' })
  @Column({ type: 'uuid', nullable: false })
  customerId: string;
  @ManyToOne(() => CustomerEntity, (customer) => customer.vouchers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ApiProperty({ description: 'Voucher được phát' })
  @Column({ type: 'uuid', nullable: false })
  voucherId: string;
  @ManyToOne(() => VoucherEntity, (voucher) => voucher.userVouchers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'voucherId' })
  voucher: VoucherEntity;

  @ApiProperty({ description: 'Mã voucher duy nhất cho user' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  uniqueCode: string;

  @ApiProperty({ description: 'Đã sử dụng chưa' })
  @Column({ type: 'boolean', default: false })
  isUsed: boolean;

  @ApiProperty({ description: 'Ngày sử dụng' })
  @Column({ type: 'timestamp', nullable: true })
  usedDate: Date;

  @ApiProperty({ description: 'Đơn hàng đã sử dụng' })
  @Column({ type: 'uuid', nullable: true })
  bookingId: string;

  @ApiProperty({ description: 'Ngày nhận voucher' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  receivedAt: Date;

  @ApiProperty({ description: 'Ngày hết hạn' })
  @Column({ type: 'timestamp', nullable: true })
  expiredAt: Date;
}
