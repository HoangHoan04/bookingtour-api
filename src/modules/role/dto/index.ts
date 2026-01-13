import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Tên vai trò',
    example: 'Trưởng phòng kinh doanh',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Mã vai trò', example: 'SALES_MANAGER' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: 'Mô tả' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateRoleDto extends CreateRoleDto {
  @ApiProperty({ description: 'ID Vai trò' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class AssignPermissionDto {
  @ApiProperty({ description: 'ID Vai trò cần phân quyền' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ description: 'Danh sách ID quyền được chọn', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
