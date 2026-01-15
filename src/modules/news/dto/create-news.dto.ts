import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from 'src/dto';

export class CreateNewsDto {
  @ApiProperty({
    type: 'string',
    nullable: false,
    maxLength: 10,
    minLength: 1,
    required: true,
    description: 'Mã tin tức, do người dùng nhập',
  })
  code: string;

  @ApiProperty({
    type: 'string',
    description: 'Tiêu đề tin tức',
    nullable: false,
    required: true,
    maxLength: 255,
  })
  titleVI: string;

  @ApiProperty({
    type: 'string',
    description: 'Tiêu đề tin tức',
    nullable: false,
    required: true,
    maxLength: 255,
  })
  titleEN: string;

  @ApiProperty({
    type: 'string',
    description: 'Nội dung tin tức',
    nullable: false,
    required: true,
  })
  contentVI: string;

  @ApiProperty({
    type: 'string',
    description: 'Nội dung tin tức',
    nullable: false,
    required: true,
  })
  contentEN: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    description: 'Link bài viết',
  })
  url: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    description: 'Loại tin tức',
  })
  type: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    description: 'Trang tin tức sẽ hiển thị',
  })
  site: string;

  @ApiProperty({
    nullable: false,
    required: true,
    description: 'Ngày bắt đầu hiệu lực của bài viết',
  })
  effectiveStartDate: Date;

  @ApiProperty({
    nullable: false,
    required: true,
    description: 'Ngày kết thúc hiệu lực của bài viết',
  })
  effectiveEndDate: Date;

  @ApiProperty({
    type: 'boolean',
    nullable: false,
    required: true,
    description: 'Trạng thái hiển thị của tin tức',
    default: true,
  })
  isVisible: boolean;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    description: 'Trạng thái bài viết',
  })
  status: 'FRESHLY_CREATED' | 'IN_EFFECT' | 'EXPIRED';

  @ApiProperty({
    type: 'string',
    nullable: false,
    description: 'Tên tiếng Việt đầy đủ của trạng thái bài viết',
  })
  statusName: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    description: 'Màu sắc của trạng thái bài viết',
  })
  statusColor: string;

  @ApiProperty({
    type: 'boolean',
    nullable: false,
    description: 'Có phải là bài viết hay không',
    default: false,
  })
  isPost: boolean;

  @ApiProperty({
    description:
      'Thứ hạng nổi bật tin tức (1-4, null để bỏ khỏi danh sách nổi bật)',
  })
  rank?: number;

  @ApiProperty({
    description: 'Danh sách hình ảnh của bài viết',
  })
  images: FileDto[];
}
