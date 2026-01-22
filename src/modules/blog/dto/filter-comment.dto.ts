import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterCommentDto {
  @ApiProperty({ description: 'ID bài viết', required: false })
  @IsOptional()
  @IsString()
  postId?: string;

  @ApiProperty({ description: 'ID người bình luận', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ description: 'Trạng thái bình luận', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'ID bình luận cha', required: false })
  @IsOptional()
  @IsString()
  parentId?: string;
}
