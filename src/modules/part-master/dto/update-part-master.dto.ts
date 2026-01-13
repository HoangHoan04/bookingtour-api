import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreatePartMasterDto } from '.';

export class UpdatePartMasterDto extends CreatePartMasterDto {
  @ApiProperty({ description: 'Id' })
  @IsNotEmpty()
  id: string;
}
