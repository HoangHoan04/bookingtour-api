import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FileDto } from 'src/dto';

export class CreateBannerDto {
  @ApiProperty({ description: 'Tiêu đề banner' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Thứ tự hiển thị banner' })
  @IsOptional()
  displayOrder?: number;

  @ApiProperty({ description: 'Trạng thái hiển thị banner' })
  @IsNotEmpty()
  isVisible: boolean;

  @ApiProperty({ description: 'Ngày bắt đầu hiệu lực của banner' })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Ngày kết thúc hiệu lực của banner' })
  effectiveEndDate?: Date;

  @ApiProperty({ description: 'Loại banner' })
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Trạng thái banner' })
  status: string;

  @ApiProperty({ description: 'Danh sách ảnh của banner' })
  @IsOptional()
  image?: FileDto[];
}
