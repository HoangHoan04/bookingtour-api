import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FileArchivalCreateDto {
  @ApiProperty({
    description: 'URL link file',
    required: true,
  })
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({
    description: 'URL link file',
    required: false,
  })
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'Tên người tạo',
    required: true,
  })
  @IsNotEmpty()
  createdBy: string;
  @ApiProperty({
    description: 'Ngày tạo',
    required: true,
  })
  @IsNotEmpty()
  createdAt: string;

  @ApiProperty({
    description: 'Name của relation',
    required: true,
  })
  @IsNotEmpty()
  fileRelationName: string;

  @ApiProperty({
    description: 'Id của relation',
    required: true,
  })
  @IsNotEmpty()
  fileRelationId: string;

  @ApiPropertyOptional({
    description: 'Loại file được upload',
  })
  @IsOptional()
  fileType: string;
}
export class FileArchivalCreateManyDto {
  @ApiProperty({
    description: 'Danh sách file',
    required: true,
  })
  @IsNotEmpty()
  files: FileArchivalCreateDto[];
}

export type DeleteKeyFile = 'customerId' | 'employeeId';
