import { ApiProperty } from '@nestjs/swagger';
import { CreateFaqDto } from './create-faq.dto';

export class UpdateFaqDto extends CreateFaqDto {
  @ApiProperty({ description: 'id FAQ' })
  id: string;
}
