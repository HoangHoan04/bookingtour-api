import { ApiProperty } from '@nestjs/swagger';

export class FilterDestinationDto {
  @ApiProperty({ description: 'Tên điểm đến' })
  name?: string;

  @ApiProperty({ description: 'Quốc gia' })
  country?: string;

  @ApiProperty({ description: 'Vùng/miền' })
  region?: string;

  @ApiProperty({ description: 'Trạng thái' })
  status?: string;

  @ApiProperty({ description: 'Trạng thái xóa' })
  isDeleted?: boolean;
}
