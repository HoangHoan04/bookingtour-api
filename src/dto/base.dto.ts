import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BaseDto<T, T1> {
  t: T;
  t1: T1;
}

export class FileDto {
  @ApiProperty({ description: 'Image file name' })
  @IsNotEmpty()
  fileName: string;
  @ApiProperty({ description: 'Image file url' })
  @IsNotEmpty()
  fileUrl: string;
}
