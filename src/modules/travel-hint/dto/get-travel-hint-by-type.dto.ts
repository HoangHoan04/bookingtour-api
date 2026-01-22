import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetTravelHintDto {
  @ApiProperty({
    description: 'Loại gợi ý du lịch (DOMESTIC, INTERNATIONAL)',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;
}
