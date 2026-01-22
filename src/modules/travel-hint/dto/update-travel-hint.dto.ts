import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateTravelHintDto } from '.';

export class UpdateTravelHintDto extends CreateTravelHintDto {
  @ApiProperty({ description: 'ID của gợi ý du lịch cần cập nhật' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
