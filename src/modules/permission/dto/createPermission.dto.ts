import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Tên quyền', example: 'Xem danh sách sản phẩm' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mã quyền (Unique)', example: 'PRODUCT:VIEW' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Module', example: 'PRODUCT' })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdatePermissionDto extends CreatePermissionDto {
  @ApiProperty({ description: 'ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
