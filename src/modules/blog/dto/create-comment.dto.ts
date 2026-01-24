import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'ID bài viết', required: true })
  @IsNotEmpty()
  @IsString()
  postId: string;

  @ApiProperty({ description: 'Nội dung bình luận', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @ApiProperty({ description: 'ID bình luận cha (nếu trả lời bình luận)' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
