import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ description: 'Mã chi nhánh' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Tên chi nhánh' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiPropertyOptional({ description: 'Tên ngắn chi nhánh' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  shortName?: string;

  @ApiPropertyOptional({ description: 'Loại chi nhánh' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @ApiPropertyOptional({
    description: 'Có phải trụ sở chính không?',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isHeadquarters?: boolean;

  @ApiPropertyOptional({ description: 'Mô tả chi nhánh' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ chi nhánh' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Địa chỉ IP' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại chi nhánh' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Email chi nhánh' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Id công ty' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Danh sách ID bộ phận mẫu (PartMaster)' })
  @IsOptional()
  @IsArray()
  partMasterIds?: string[];
}
