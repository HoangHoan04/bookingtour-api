import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTourDetailDto {
  @ApiProperty({ description: 'Ngày bắt đầu tour', example: '2024-12-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDay: Date;

  @ApiProperty({ description: 'Ngày kết thúc tour', example: '2024-12-05' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDay: Date;

  @ApiProperty({ description: 'Địa điểm bắt đầu tour' })
  @IsString()
  @IsNotEmpty()
  startLocation: string;

  @ApiProperty({ description: 'Sức chứa tối đa', example: 20 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Trạng thái tour detail',
    required: false,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'ID hướng dẫn viên',
    required: false,
  })
  @IsOptional()
  @IsString()
  tourGuideId?: string;
}
