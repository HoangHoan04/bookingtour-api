import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreatePositionDto } from './create-position.dto';

export class UpdatePositionDto extends CreatePositionDto {
  @ApiProperty({ description: 'Id' })
  @IsNotEmpty()
  id: string;
}
