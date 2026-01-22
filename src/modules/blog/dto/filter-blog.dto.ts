import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterBlogDto {
  @ApiPropertyOptional({ description: 'Tiêu đề bài viết' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Danh mục bài viết' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xuất bản' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Trạng thái xóa' })
  @IsOptional()
  isDeleted?: boolean;
}
