import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'Id user' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Tài khoản' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Tên nhân viên' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Id khách hàng' })
  customerId?: string;

  @ApiProperty({ description: 'Id hướng dẫn viên' })
  tourGuideId?: string;

  @ApiProperty({
    description: 'Có phải là tài khoản Admin hay không',
    example: 'true',
  })
  isAdmin: boolean;

  @ApiProperty({ description: 'Các module được hiển thị ' })
  modules: string[];

  @ApiProperty({ description: 'Các quyền của user' })
  userRoles: string[];
}
