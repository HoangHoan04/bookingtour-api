import { ApiProperty } from '@nestjs/swagger';

export class FilterFaqDto {
  @ApiProperty({ description: 'Câu hỏi', required: false })
  question?: string;

  @ApiProperty({ description: 'Danh mục FAQ', required: false })
  category?: string;

  @ApiProperty({ description: 'Trạng thái FAQ', required: false })
  status?: string;

  @ApiProperty({ description: 'Trạng thái xóa', required: false })
  isDeleted?: boolean;
}
