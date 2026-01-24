import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { enumData } from 'src/common/constants';
import { FileDto } from 'src/dto';

export class CreateTourDto {
  @ApiProperty({ description: 'Mã tour' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Tiêu đề tour' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Slug tour' })
  @IsString()
  @IsNotEmpty()
  slug: string;

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

  @ApiProperty({ description: 'Tags', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Trạng thái tour',
    default: enumData.TOUR_STATUS.ACTIVE.code,
  })
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Hình ảnh tour' })
  @IsOptional()
  @IsString()
  images?: FileDto[];
}
