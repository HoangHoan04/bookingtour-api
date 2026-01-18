import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class FilterNewsDto {
  @ApiPropertyOptional({ description: 'Mã tin tức' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Tiêu đề' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Loại tin tức' })
  @IsOptional()
  @IsString()
  types?: string;

  @ApiPropertyOptional({
    description: 'Ngày bắt đầu hiệu lực',
  })
  @IsOptional()
  @IsDate()
  effectiveStartDate?: Date;

  @ApiPropertyOptional({
    description: 'Ngày kết thúc hiệu lực',
  })
  @IsOptional()
  @IsDate()
  effectiveEndDate?: Date;

  @ApiPropertyOptional({ description: 'Trạng thái bài viết' })
  @IsOptional()
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: 'Trạng thái đã xóa bài viết' })
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Có phải là bài viết hay không' })
  @IsOptional()
  isPost?: boolean;
}
