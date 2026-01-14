import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'Id user',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Tài khoản', example: 'userX' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Tên nhân viên', example: 'Nguyễn Văn A' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Id nhân viên',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  employeeId: string;

  @ApiProperty({
    description: 'Id khách hàng',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  customerId?: string;

  @ApiProperty({
    description: 'Có phải là tài khoản Admin hay không',
    example: 'true',
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Các module được hiển thị ',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  modules: string[];
}
