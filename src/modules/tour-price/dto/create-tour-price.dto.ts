import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTourPriceDto {
  @ApiProperty({ description: 'Mã giá tour' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Loại giá (người lớn, trẻ em, VIP...)' })
  @IsString()
  @IsNotEmpty()
  priceType: string;

  @ApiProperty({ description: 'Giá tour' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Đơn vị tiền tệ', default: 'VND' })
  @IsOptional()
  @IsString()
  currency?: string = 'VND';

  @ApiProperty({ description: 'ID tour detail' })
  @IsUUID()
  tourDetailId: string;
}
