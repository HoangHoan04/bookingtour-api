import { ApiProperty } from '@nestjs/swagger';

export class SearchDestinationDto {
  @ApiProperty({ description: 'Từ khóa tìm kiếm', required: true })
  keyword: string;

  @ApiProperty({ description: 'Số lượng kết quả', required: false })
  limit?: number;
}
