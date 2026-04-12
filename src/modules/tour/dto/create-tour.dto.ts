import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { enumData } from 'src/common/constants';
import { FileDto } from 'src/dto';
import { CreateTourDetailDto } from './create-tour-detail.dto';

export class CreateTourDto {
  @ApiProperty({ description: 'Tiêu đề tour' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Địa điểm' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Thời gian tour' })
  @IsString()
  durations: string;

  @ApiProperty({ description: 'Mô tả ngắn' })
  @IsString()
  shortDescription: string;

  @ApiProperty({ description: 'Mô tả chi tiết' })
  @IsOptional()
  @IsString()
  longDescription?: string;

  @ApiProperty({ description: 'Điểm nổi bật' })
  @IsOptional()
  @IsString()
  highlights?: string;

  @ApiProperty({ description: 'Bao gồm' })
  @IsOptional()
  @IsString()
  included?: string;

  @ApiProperty({ description: 'Không bao gồm' })
  @IsOptional()
  @IsString()
  excluded?: string;

  @ApiProperty({ description: 'Danh mục' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Tags', required: false })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({
    description: 'Trạng thái tour',
    default: enumData.TOUR_STATUS.ACTIVE.code,
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Danh sách chi tiết tour (các chuyến đi cụ thể)',
    type: [CreateTourDetailDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTourDetailDto)
  tourDetails?: CreateTourDetailDto[];

  @ApiProperty({ description: 'Danh sách ảnh của tour' })
  @IsOptional()
  image?: FileDto[];
}
