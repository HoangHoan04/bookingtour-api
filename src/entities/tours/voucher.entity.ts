import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserVoucherEntity } from './user_voucher.entity';

@Entity('vouchers')
export class VoucherEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã voucher (VD: SUMMER2024)' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  code: string;

  @ApiProperty({ description: 'Tên chương trình khuyến mãi' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ApiProperty({ description: 'Mô tả chi tiết voucher' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Loại giảm giá (% hoặc số tiền)' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  discountType: string;

  @ApiProperty({ description: 'Giá trị giảm' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  discountValue: number;

  @ApiProperty({ description: 'Giảm tối đa (với loại %)' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxDiscount: number;

  @ApiProperty({ description: 'Giá trị đơn hàng tối thiểu' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  minOrder: number;

  @ApiProperty({ description: 'Số lượng voucher phát hành' })
  @Column({ type: 'int', nullable: true })
  quantity: number;

  @ApiProperty({ description: 'Số lần đã sử dụng' })
  @Column({ type: 'int', default: 0 })
  usedCount: number;

  @ApiProperty({ description: 'Tour áp dụng (null = all tours)' })
  @Column({ type: 'json', nullable: true })
  applicableTours: string[];

  @ApiProperty({ description: 'Danh mục tour áp dụng' })
  @Column({ type: 'json', nullable: true })
  applicableCategories: string[];

  @ApiProperty({ description: 'Trạng thái voucher' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @ApiProperty({ description: 'Ngày bắt đầu' })
  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;

  @ApiProperty({ description: 'Ngày hết hạn' })
  @Column({ type: 'timestamp', nullable: false })
  endDate: Date;

  @ApiProperty({ description: 'Voucher của khách hàng' })
  @OneToMany(() => UserVoucherEntity, (p) => p.voucher)
  userVouchers: Promise<UserVoucherEntity[]>;
}
