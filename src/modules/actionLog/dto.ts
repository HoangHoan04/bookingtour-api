import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class ActionLogFilterDto {
  @ApiProperty({
    description: 'Id',
    required: true,
  })
  @IsNotEmpty()
  functionId: string;

  @ApiProperty({
    description: 'Loại hàm',
    required: true,
  })
  @IsNotEmpty()
  functionType: string;
  @ApiProperty({
    description: 'Loại thao tác',
    required: true,
  })
  @IsOptional()
  type: string;
  @ApiProperty({
    description: 'Tên người tạo',
    required: true,
  })
  @IsOptional()
  createdBy: string;
}

export class ActionLogCreateDto {
  @ApiProperty({
    description: 'Id',
    required: true,
  })
  @IsNotEmpty()
  functionId: string;
  @ApiProperty({
    description: 'Loại hàm',
    required: true,
  })
  @IsNotEmpty()
  functionType: string;
  @ApiProperty({
    description: 'Loại thao tác',
    required: true,
  })
  @IsNotEmpty()
  type: string;
  @ApiProperty({
    description: 'Tên người tạo',
    required: true,
  })
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({
    description: 'Mã người tạo',
  })
  @IsOptional()
  createdById?: string;

  @ApiProperty({
    description: 'Tên người tạo',
    required: true,
  })
  @IsNotEmpty()
  createdByName: string;
  @ApiProperty({
    description: 'Nội dung',
    required: true,
  })
  @IsNotEmpty()
  oldData?: string;
  @ApiProperty({
    description: 'Nội dung mới',
    required: true,
  })
  @IsNotEmpty()
  newData?: string;

  @ApiProperty({
    description: 'Mô tả',
    required: true,
  })
  @IsNotEmpty()
  description: string;
}
