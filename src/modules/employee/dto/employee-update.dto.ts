import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import {
  CreateEmployeeCertificateDto,
  CreateEmployeeDto,
  CreateEmployeeEducationDto,
} from './employee-create.dto';

export class UpdateEmployeeDto extends CreateEmployeeDto {
  @ApiProperty({ description: 'Id' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateEmployeeEducationDto extends CreateEmployeeEducationDto {
  @ApiProperty({ description: 'ID' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class UpdateEmployeeCertificateDto extends CreateEmployeeCertificateDto {
  @ApiProperty({ description: 'ID bản ghi' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
