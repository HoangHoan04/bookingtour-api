import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetBannerDto {
  @ApiProperty({
    description: 'Loại banner (HOME, TOUR, NEWS, BLOG, etc.)',
    required: false,
    example: 'HOME',
  })
  @IsOptional()
  @IsString()
  type?: string;
}
