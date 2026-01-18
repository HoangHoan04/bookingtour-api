import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from 'src/dto';

export class CreateNewsDto {
  @ApiProperty({ description: 'Mã tin tức' })
  code: string;

  @ApiProperty({ description: 'Tiêu đề tin tức' })
  titleVI: string;

  @ApiProperty({ description: 'Tiêu đề tin tức' })
  titleEN: string;

  @ApiProperty({ description: 'Nội dung tin tức' })
  contentVI: string;

  @ApiProperty({ description: 'Nội dung tin tức' })
  contentEN: string;

  @ApiProperty({ description: 'Link bài viết' })
  url: string;

  @ApiProperty({ description: 'Loại tin tức' })
  type: string;

  @ApiProperty({ description: 'Ngày bắt đầu hiệu lực của bài viết' })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Ngày kết thúc hiệu lực của bài viết' })
  effectiveEndDate: Date;

  @ApiProperty({ description: 'Trạng thái hiển thị của tin tức' })
  isVisible: boolean;

  @ApiProperty({ description: 'Trạng thái bài viết' })
  status: string;

  @ApiProperty({
    description:
      'Thứ hạng nổi bật tin tức (1-4, null để bỏ khỏi danh sách nổi bật)',
  })
  rank?: number;

  @ApiProperty({ description: 'Danh sách hình ảnh của bài viết' })
  images: FileDto[];
}
