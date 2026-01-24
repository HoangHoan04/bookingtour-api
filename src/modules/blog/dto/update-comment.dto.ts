import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: 'Nội dung bình luận' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;
}
