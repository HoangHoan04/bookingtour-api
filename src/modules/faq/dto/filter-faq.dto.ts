import { ApiProperty } from '@nestjs/swagger';

export class FilterFaqDto {
  @ApiProperty({ description: 'Câu hỏi' })
  question?: string;

  @ApiProperty({ description: 'Danh mục FAQ' })
  category?: string;

  @ApiProperty({ description: 'Trạng thái FAQ' })
  status?: string;

  @ApiProperty({ description: 'Trạng thái xóa' })
  isDeleted?: boolean;
}
