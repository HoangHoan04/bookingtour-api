import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBookingDetailDto {
  @ApiProperty({ description: 'Giá snapshot tại thời điểm đặt' })
  price: number;

  @ApiProperty({ description: 'Mã tour đã đặt' })
  @IsString()
  @IsUUID()
  tourId: string;

  @ApiProperty({ description: 'Mã tour đã đặt' })
  @IsString()
  @IsUUID()
  tourDetailId: string;

  @ApiProperty({ description: 'Mã giá tour đã đặt' })
  @IsString()
  @IsUUID()
  tourPriceId: string;

  @ApiProperty({ description: 'Số lượng đã đặt' })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Trạng thái chi tiết đặt' })
  @IsString()
  status?: string;
}
