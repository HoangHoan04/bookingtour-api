import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreatePositionMasterDto } from './create-position-master.dto';

export class UpdatePositionMasterDto extends CreatePositionMasterDto {
  @ApiProperty({ description: 'Id' })
  @IsNotEmpty()
  id: string;
}
