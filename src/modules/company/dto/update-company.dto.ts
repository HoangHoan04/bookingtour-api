import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends CreateCompanyDto {
  @ApiProperty({ description: 'Id' })
  @IsNotEmpty()
  id: string;
}
