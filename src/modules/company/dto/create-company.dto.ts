import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { FileDto } from 'src/dto';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Mã công ty' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Tên công ty' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mô tả công ty', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Địa chỉ công ty', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Mã số thuế', required: false })
  @IsString()
  @IsOptional()
  taxCode?: string;

  @ApiProperty({ description: 'Số điện thoại công ty', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Email công ty', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Website công ty', required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: 'Ngày thành lập', required: false })
  @IsOptional()
  foundedDate?: Date;

  @ApiProperty({ description: 'Người đại diện pháp luật', required: false })
  @IsString()
  @IsOptional()
  legalRepresentative?: string;

  @ApiProperty({ description: 'ID Công ty cha', required: false })
  @IsUUID()
  @IsOptional()
  parentCompanyId?: string;

  @ApiProperty({ description: 'Logo công ty', required: false })
  @IsOptional()
  logoUrl?: FileDto[];

  @ApiProperty({ description: 'Tài liệu công ty', required: false })
  @IsOptional()
  documents?: FileDto[];
}

export class ImportCompanyItemDto {
  @ApiProperty({ description: 'Mã công ty', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Tên công ty', required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Mã số thuế', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  taxCode?: string;

  @ApiProperty({ description: 'Địa chỉ', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ description: 'Website', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Ngày thành lập', required: false })
  @IsOptional()
  @IsDateString()
  foundedDate?: Date;

  @ApiProperty({ description: 'Người đại diện pháp luật', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  legalRepresentative?: string;

  @ApiProperty({ description: 'Mã công ty cha', required: false })
  @IsOptional()
  @IsString()
  parentCompanyCode?: string;
}

export class ImportCompanyDto {
  @ApiProperty({
    description: 'Danh sách công ty cần import',
    type: [ImportCompanyItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportCompanyItemDto)
  companies: ImportCompanyItemDto[];
}
