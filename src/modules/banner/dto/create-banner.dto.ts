import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUrl } from 'class-validator';
import { FileDto } from 'src/dto';

export class CreateBannerDto {
  @ApiProperty({ description: 'Link đích khi click vào banner' })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({
    description: 'Thứ tự hiển thị banner trong loại (1, 2, 3...)',
  })
  @IsNumber()
  displayOrderByType: number;

  @ApiProperty({ description: 'Tiêu đề banner' })
  title: string;

  @ApiProperty({ description: 'Tiêu đề banner (EN)' })
  titleEn: string;

  @ApiProperty({
    nullable: false,
    required: true,
    description: 'Ngày bắt đầu hiệu lực của banner',
  })
  effectiveStartDate: Date;

  @ApiProperty({ description: 'Ngày kết thúc hiệu lực của banner' })
  effectiveEndDate?: Date;

  @ApiProperty({ description: 'Hình ảnh của banner' })
  image: FileDto;

  @ApiProperty({ description: 'Trạng thái hiển thị banner' })
  isVisible: boolean;

  @ApiProperty({ description: 'Loại banner' })
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Trang banner sẽ hiển thị' })
  @IsOptional()
  site?: string;
}
