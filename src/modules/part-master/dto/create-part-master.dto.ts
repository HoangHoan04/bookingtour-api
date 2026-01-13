import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePartMasterDto {
  @ApiProperty({ description: 'Mã bộ phận master' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Tên bộ phận master',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Danh sách ID chi nhánh áp dụng',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  branchIds?: string[];
}
