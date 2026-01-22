import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FileDto } from 'src/dto';

export class CreateTravelHintDto {
  @ApiProperty({ description: 'Tháng gợi ý du lịch' })
  @IsNotEmpty()
  month: number;

  @ApiProperty({ description: 'Tên địa điểm du lịch' })
  @IsNotEmpty()
  @IsString()
  locationName: string;

  @ApiProperty({ description: 'Mô tả ngắn gọn' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Lý do nên đi vào tháng này' })
  @IsOptional()
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Loại du lịch' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Danh sách thẻ (tags) liên quan' })
  @IsOptional()
  tags: string[];

  @ApiProperty({ description: 'Quốc gia (nếu nước ngoài)' })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({ description: 'Thành phố / tỉnh' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({ description: 'Vĩ độ (latitude)' })
  @IsOptional()
  @IsString()
  latitude: number;

  @ApiProperty({ description: 'Kinh độ (longitude)' })
  @IsOptional()
  @IsString()
  longitude: number;

  @ApiProperty({ description: 'Danh sách ảnh của banner' })
  @IsOptional()
  images?: FileDto[];
}
