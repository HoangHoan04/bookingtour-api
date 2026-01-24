import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { enumData } from 'src/common/constants';

export class UpdateCommentStatusDto {
  @ApiProperty({ description: 'Trạng thái bình luận' })
  @IsNotEmpty()
  @IsEnum(enumData.BLOG_COMMENT_STATUS)
  status: keyof typeof enumData.BLOG_COMMENT_STATUS;
}
