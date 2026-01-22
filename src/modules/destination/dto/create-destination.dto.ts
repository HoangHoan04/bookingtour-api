import { ApiProperty } from '@nestjs/swagger';

export class CreateDestinationDto {
  @ApiProperty({ description: 'Mã điểm đến' })
  code: string;

  @ApiProperty({ description: 'Tên điểm đến' })
  name: string;

  @ApiProperty({ description: 'URL slug' })
  slug: string;

  @ApiProperty({ description: 'Quốc gia' })
  country: string;

  @ApiProperty({ description: 'Vùng/miền' })
  region: string;

  @ApiProperty({ description: 'Mô tả điểm đến' })
  description: string;

  @ApiProperty({ description: 'Ảnh đại diện' })
  imageUrl: string;

  @ApiProperty({ description: 'Vĩ độ' })
  latitude: number;

  @ApiProperty({ description: 'Kinh độ' })
  longitude: number;

  @ApiProperty({ description: 'Thời gian tốt nhất' })
  bestTimeToVisit: string;

  @ApiProperty({ description: 'Nhiệt độ trung bình' })
  averageTemperature: string;

  @ApiProperty({ description: 'Hoạt động phổ biến' })
  popularActivities: string[];

  @ApiProperty({ description: 'Trạng thái ACTIVE/INACTIVE' })
  status: string;
}
