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
  @ApiProperty({
    description: 'ID tour',
    format: 'uuid',
  })
  @IsString()
  @IsUUID()
  tourId: string;

  @ApiProperty({
    description: 'Mã tour detail',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'Ngày bắt đầu tour (ISO 8601)',
    example: '2025-02-20',
  })
  @IsDateString()
  startDay: string;

  @ApiProperty({
    description: 'Ngày kết thúc tour (ISO 8601)',
    example: '2025-02-28',
  })
  @IsDateString()
  endDay: string;

  @ApiProperty({ description: 'Địa điểm bắt đầu' })
  @IsString()
  @IsNotEmpty()
  startLocation: string;

  @ApiProperty({ description: 'Sức chứa tối đa' })
  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsString()
  status?: string;
}
