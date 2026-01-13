import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreatePartDto } from './create-part.dto';

export class UpdatePartDto extends CreatePartDto {
  @ApiProperty({ description: 'Id' })
  @IsNotEmpty()
  id: string;
}
