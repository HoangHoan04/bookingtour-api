import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateTourGuideDto } from './createTourGuide.dto';

export class UpdateTourGuideDto extends CreateTourGuideDto {
  @ApiProperty({ description: 'ID hướng dẫn viên' })
  id: string;
}

export class UpdateTourGuideAvatarDto {
  @ApiProperty({ description: 'url avatar' })
  @IsString()
  avatarUrl: string;
}
