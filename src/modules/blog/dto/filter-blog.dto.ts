import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class FilterBlogDto {
  @ApiPropertyOptional({ description: 'Mã khách hàng' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Tên khách hàng' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Giới tính' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Trạng thái' })
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional({ description: 'Loại khách hàng' })
  @IsOptional()
  @IsUUID()
  customerTypeId?: string;
}
