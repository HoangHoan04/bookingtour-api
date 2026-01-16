import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateTourDetailDto {
  @ApiProperty({ description: 'ID tour' })
  @IsUUID()
  tourId: string;

  @ApiProperty({ description: 'Mã tour detail', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Ngày bắt đầu tour' })
  @IsDateString()
  startDay: Date;

  @ApiProperty({ description: 'Ngày kết thúc tour' })
  @IsDateString()
  endDay: Date;

  @ApiProperty({ description: 'Địa điểm bắt đầu' })
  @IsString()
  @IsNotEmpty()
  startLocation: string;

  @ApiProperty({ description: 'Sức chứa tối đa' })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ description: 'Số chỗ còn lại' })
  @IsInt()
  @Min(0)
  remainingSeats: number;

  @ApiProperty({ description: 'Trạng thái tour' })
  @IsString()
  status: string;
}
