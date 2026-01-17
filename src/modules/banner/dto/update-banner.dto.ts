import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBannerDto } from './create-banner.dto';

export class UpdateBannerDto extends CreateBannerDto {
  @ApiProperty({ description: 'ID của banner cần cập nhật' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
