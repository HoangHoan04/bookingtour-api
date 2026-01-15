import { ApiProperty } from '@nestjs/swagger';
import { CreateBlogDto } from '.';

export class UpdateBlogDto extends CreateBlogDto {
  @ApiProperty({ description: 'ID bài viết' })
  id: string;
}
