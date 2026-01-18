import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: 'Nội dung bình luận', required: true })
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  @IsString()
  @MaxLength(500, { message: 'Nội dung bình luận không được quá 500 ký tự' })
  content: string;
}
