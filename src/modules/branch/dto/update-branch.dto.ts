import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateBranchDto } from './create-banch.dto';

export class UpdateBranchDto extends CreateBranchDto {
  @ApiProperty({ description: 'ID chi nhánh' })
  @IsUUID()
  id: string;
}
