import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePositionDto {
  @ApiProperty({ description: 'Mã vị trí nhân viên', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Tên vị trí nhân viên', maxLength: 250 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({ description: 'Mô tả công ty', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID Công ty', required: false })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ description: 'ID phòng ban', required: false })
  @IsUUID()
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ description: 'ID chi nhánh', required: false })
  @IsUUID()
  @IsOptional()
  branchId?: string;

  @ApiProperty({ description: 'ID bộ phận', required: false })
  @IsUUID()
  @IsOptional()
  partId?: string;

  @ApiProperty({
    description: 'Có giới hạn giờ làm việc',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isLimitHoursWorking?: boolean;

  @ApiProperty({
    description: 'Giới hạn theo enum PositionLimit',
    required: false,
  })
  @IsString()
  @IsOptional()
  limit?: string;

  @ApiProperty({ description: 'giờ công', required: false })
  @IsNumber()
  @IsOptional()
  workingHour?: number;

  @ApiProperty({ description: 'Có chấm công hay không ?', required: false })
  @IsBoolean()
  @IsOptional()
  isTimeKeeping?: boolean;

  @ApiProperty({ description: 'Giờ bắt đầu làm việc', required: false })
  @IsOptional()
  hourWorkingStart?: string;

  @ApiProperty({ description: 'Giờ kết thúc làm việc', required: false })
  @IsOptional()
  hourWorkingEnd?: string;

  @ApiProperty({ description: 'Giờ bắt đầu nghỉ trưa', required: false })
  @IsOptional()
  hourSnapShotStart?: string;

  @ApiProperty({ description: 'Giờ kết thúc nghỉ trưa', required: false })
  @IsOptional()
  hourSnapShotEnd?: string;

  @ApiProperty({ description: 'Giờ làm việc tối thiểu', required: false })
  @IsNumber()
  @IsOptional()
  minimumWorkingHour?: number;

  @ApiProperty({ description: 'Có đổi vị trí hay không ?', required: false })
  @IsBoolean()
  @IsOptional()
  isSwapPosition?: boolean;

  @ApiProperty({
    description: 'Danh sách Mã vị trí đổi (Lưu dạng string)',
    required: false,
  })
  @IsString()
  @IsOptional()
  targetChangePositionId?: string;

  @ApiProperty({
    description: ' Có yêu cầu duyệt khi tuyển dụng',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isApprovedWhenHiringCandidate?: boolean;

  @ApiProperty({ description: 'Nội dung', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'ID vị trí master', required: false })
  @IsUUID()
  @IsOptional()
  positionMasterId?: string;
}
