import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterCommentDto {
  @ApiProperty({ description: 'ID bài viết' })
  @IsOptional()
  @IsString()
  postId?: string;

  @ApiProperty({ description: 'ID người bình luận' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ description: 'Trạng thái bình luận' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'ID bình luận cha' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
