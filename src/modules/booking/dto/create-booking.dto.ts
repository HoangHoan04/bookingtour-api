import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { CreateBookingDetailDto } from './create-booking-detail.dto';

export class CreateBookingDto {
  @ApiProperty({ description: 'Mã đơn đặt tour', required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ description: 'Tên liên hệ' })
  @IsString()
  contactFullname: string;

  @ApiProperty({ description: 'Email liên hệ' })
  @IsString()
  contactEmail: string;

  @ApiProperty({ description: 'Số điện thoại liên hệ' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ description: 'Địa chỉ liên hệ' })
  @IsString()
  contactAddress: string;

  @ApiProperty({ description: 'Ghi chú đặc biệt từ khách', required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ description: 'Tổng giá tiền đơn đặt' })
  totalPrice: number;

  @ApiProperty({ description: 'Số tiền giảm giá', required: false })
  @IsOptional()
  discountAmount?: number;

  @ApiProperty({
    description: 'Giá tiền cuối cùng sau khi giảm giá',
    required: false,
  })
  @IsOptional()
  finalPrice?: number;

  @ApiProperty({ description: 'Mã voucher đã sử dụng', required: false })
  @IsString()
  @IsOptional()
  voucherCode?: string;

  @ApiProperty({ description: 'Ngày hết hạn đơn đặt', required: false })
  @IsOptional()
  @IsString()
  @IsDateString()
  expiredAt?: string;

  @ApiProperty({ description: 'Ngày xác nhận đơn đặt', required: false })
  @IsString()
  @IsOptional()
  @IsDateString()
  confirmedAt?: string;

  @ApiProperty({ description: 'Trạng thái đơn đặt', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  bookingDetails?: CreateBookingDetailDto[];
}
