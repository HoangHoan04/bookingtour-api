import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatQueryDto {
  @ApiProperty({ description: 'Câu hỏi của người dùng' })
  @IsNotEmpty()
  @IsString()
  query: string;
}
