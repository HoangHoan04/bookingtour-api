import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FilterOneDto {
  @ApiProperty({
    description: 'Id của đối tượng',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  @IsOptional()
  id?: string;
}
