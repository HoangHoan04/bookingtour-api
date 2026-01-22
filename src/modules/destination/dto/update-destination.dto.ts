import { ApiProperty } from '@nestjs/swagger';
import { CreateDestinationDto } from './create-destination.dto';

export class UpdateDestinationDto extends CreateDestinationDto {
  @ApiProperty({ description: 'id điểm đến' })
  id: string;
}
