import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends CreateDepartmentDto {
  @ApiProperty({ description: 'ID phòng ban' })
  @IsNotEmpty()
  id: string;
}
