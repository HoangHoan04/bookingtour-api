import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { BookingEntity } from './booking.entity';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @ApiProperty({ description: 'Mã thanh toán' })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  code: string;

  @ApiProperty({ description: 'Số tiền thanh toán' })
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: false })
  amount: number;

  @ApiProperty({ description: 'Phương thức thanh toán' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  method: string;

  @ApiProperty({ description: 'Mã giao dịch' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  transactionId: string;

  @ApiProperty({ description: 'Mã ngân hàng' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  bankCode: string;

  @ApiProperty({ description: 'Mã phản hồi' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  responseCode: string;

  @ApiProperty({ description: 'Thông điệp phản hồi' })
  @Column({ type: 'text', nullable: true })
  responseMessage: string;

  @ApiProperty({ description: 'Thời gian thanh toán thành công' })
  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @ApiProperty({ description: 'Trạng thái thanh toán' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @ApiProperty({ description: 'Mã đặt chỗ' })
  @Column({ type: 'uuid', nullable: false })
  bookingId: string;
  @ManyToOne(() => BookingEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;
}
