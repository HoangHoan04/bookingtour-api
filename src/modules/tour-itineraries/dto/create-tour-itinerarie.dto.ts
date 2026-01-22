import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTourItinerarieDto {
  @ApiProperty({ description: 'ID tour detail' })
  @IsUUID()
  tourDetailId: string;

  @ApiProperty({ description: 'Mã lịch trình' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Tiêu đề lịch trình' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Ngày thứ mấy' })
  @IsInt()
  dayNumber: number;

  @ApiProperty({ description: 'Nội dung chi tiết' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Hoạt động' })
  @IsString()
  activities: string;

  @ApiProperty({ description: 'Bữa ăn' })
  @IsString()
  meals: string;

  @ApiProperty({ description: 'Nơi ở' })
  @IsString()
  accommodation: string;
}
