import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'ID bài viết', required: true })
  @IsNotEmpty({ message: 'ID bài viết không được để trống' })
  @IsString()
  postId: string;

  @ApiProperty({ description: 'Nội dung bình luận', required: true })
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  @IsString()
  @MaxLength(500, { message: 'Nội dung bình luận không được quá 500 ký tự' })
  content: string;

  @ApiProperty({
    description: 'ID bình luận cha (nếu trả lời bình luận)',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}
