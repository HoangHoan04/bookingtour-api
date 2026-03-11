import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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

export class SlugDto {
  @ApiProperty({
    description: 'Slug của điểm đến',
    example: 'nghe-an-djfb',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class CodeDto {
  @ApiProperty({
    description: 'Code của đối tượng',
    example: 'CODE123',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class TourIdDto {
  @ApiProperty({
    description: 'Id của tour',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  @IsNotEmpty()
  tourId: string;
}
