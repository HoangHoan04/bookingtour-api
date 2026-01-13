import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePositionMasterDto {
  @ApiProperty({ description: 'Mã vị trí master', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Tên vị trí master', maxLength: 250 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiProperty({ description: 'Mô tả vị trí master', required: false })
  @IsString()
  @IsOptional()
  description?: string;

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

  /** Danh sách Mã vị trí đổi (Lưu dạng string)*/
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

  @ApiProperty({ description: 'Có phỏng vấn lần 2 ?', required: false })
  @IsBoolean()
  @IsOptional()
  isHadASecondInterview?: boolean;

  @ApiProperty({ description: 'Nội dung', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  /** Có quyền duyệt ngày nghỉ (Trưởng nhóm, Trưởng bộ phận) ? */
  @ApiProperty({
    description: 'Có quyền duyệt ngày nghỉ (Trưởng nhóm, Trưởng bộ phận) ?',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isApprovedDayOff?: boolean;
}
