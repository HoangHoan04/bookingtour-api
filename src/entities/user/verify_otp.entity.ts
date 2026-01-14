import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('verify_otp')
export class VerifyOtpEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  id?: string;

  @Index()
  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  createdDate?: Date;

  @ApiProperty({ description: 'Mã otp' })
  @Column({ type: 'varchar', length: 50, comment: 'Mã otp' })
  otpCode: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Số điện thoại',
    nullable: true,
  })
  phone: string;

  @ApiProperty({ description: 'email' })
  @Column({ type: 'varchar', length: 50, comment: 'email', nullable: true })
  email?: string;

  @ApiProperty({ description: 'Phương thức gửi otp EOTPSendMethod' })
  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Phương thức gửi otp EOTPSendMethod',
  })
  sendMethod: string;

  @ApiProperty({ description: 'Thời hạn mã xác thực', required: false })
  @Column({
    type: 'timestamptz',
    nullable: true,
    comment: 'Thời hạn mã xác thực',
  })
  dateExpired: Date;

  @Column({ type: 'text', nullable: true, comment: 'Lỗi khi gửi (nếu có)' })
  error: string;
}
