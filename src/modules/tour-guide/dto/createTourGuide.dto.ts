import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { FileDto } from 'src/dto';
export class CreateTourGuideDto {
  @ApiProperty({ description: 'Họ và tên hướng dẫn viên' })
  @IsString()
  @IsNotEmpty({ message: 'Tên hướng dẫn viên không được để trống' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Số điện thoại hướng dẫn viên' })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Giới tính hướng dẫn viên', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'Email hướng dẫn viên', required: false })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'URL avatar của hướng dẫn viên',
    required: false,
  })
  @IsOptional()
  avatar?: FileDto[];
}
