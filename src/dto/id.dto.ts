import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdDto {
  @ApiProperty({
    description: 'Id của đối tượng',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  id: string;
}
