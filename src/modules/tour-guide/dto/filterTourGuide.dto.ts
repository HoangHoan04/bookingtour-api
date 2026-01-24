import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterTourGuideDto {
  @ApiPropertyOptional({ description: 'Mã hướng dẫn viên' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Tên hướng dẫn viên' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại hướng dẫn viên' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Giới tính hướng dẫn viên' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Email hướng dẫn viên' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Trạng thái' })
  @IsOptional()
  isDeleted?: boolean;
}
