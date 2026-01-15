import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileDto } from 'src/dto';
export class CreateBlogDto {
  @ApiProperty({ description: 'Họ và tên khách hàng' })
  @IsString()
  @IsNotEmpty({ message: 'Tên khách hàng không được để trống' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Số điện thoại khách hàng' })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Giới tính khách hàng', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'Email khách hàng', required: false })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'URL avatar của khách hàng',
    required: false,
  })
  @IsOptional()
  avatar?: FileDto[];
}
