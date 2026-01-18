import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ description: 'Câu hỏi' })
  question: string;

  @ApiProperty({ description: 'Câu trả lời' })
  answer: string;

  @ApiProperty({ description: 'Danh mục FAQ' })
  category: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  displayOrder: number;

  @ApiProperty({ description: 'Tags để tìm kiếm' })
  tags: string[];

  @ApiProperty({ description: 'Trạng thái FAQ' })
  status: string;
}
