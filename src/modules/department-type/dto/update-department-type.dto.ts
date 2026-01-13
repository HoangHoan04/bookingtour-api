import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateDepartmentTypeDto } from './create-department-type.dto';

export class UpdateDepartmentTypeDto extends CreateDepartmentTypeDto {
  @ApiProperty({ description: 'Id' })
  @IsNotEmpty()
  id: string;
}
