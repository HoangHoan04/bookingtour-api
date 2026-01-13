import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Mã phòng ban' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Tên phòng ban' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả phòng ban' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Giới hạn nhân viên' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  limit: number;

  @ApiPropertyOptional({ description: 'ID Loại phòng ban' })
  @IsOptional()
  @IsUUID()
  departmentTypeId?: string;

  @ApiPropertyOptional({ description: 'ID Công ty' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'ID Chi nhánh' })
  @IsOptional()
  @IsUUID()
  branchId?: string;

  @ApiPropertyOptional({ description: 'ID Phòng ban cha (nếu có)' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
