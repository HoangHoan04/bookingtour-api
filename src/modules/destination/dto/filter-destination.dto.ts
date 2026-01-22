import { ApiProperty } from '@nestjs/swagger';

export class FilterDestinationDto {
  @ApiProperty({ description: 'Tên điểm đến', required: false })
  name?: string;

  @ApiProperty({ description: 'Quốc gia', required: false })
  country?: string;

  @ApiProperty({ description: 'Vùng/miền', required: false })
  region?: string;

  @ApiProperty({ description: 'Trạng thái', required: false })
  status?: string;

  @ApiProperty({ description: 'Trạng thái xóa', required: false })
  isDeleted?: boolean;
}
