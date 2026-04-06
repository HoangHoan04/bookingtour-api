import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { enumData } from 'src/common/constants';

export class CreateTourPriceDto {
  @ApiProperty({ description: 'Mã giá tour' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Loại giá (người lớn, trẻ em, VIP...)',
    default: enumData.TOUR_PRICE_TYPE.ADULT.code,
  })
  @IsString()
  @IsOptional()
  priceType?: string;

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
