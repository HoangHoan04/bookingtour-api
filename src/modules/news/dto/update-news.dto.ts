import { ApiProperty } from '@nestjs/swagger';
import { CreateNewsDto } from './create-news.dto';

export class UpdateNewsDto extends CreateNewsDto {
  @ApiProperty({ description: 'id tin tức' })
  id: string;
}
