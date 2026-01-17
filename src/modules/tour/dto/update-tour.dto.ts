import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';
import { CreateTourDto } from './create-tour.dto';

export class UpdateTourDto extends CreateTourDto {
  @ApiProperty({ description: 'Id của tour' })
  @Column({ type: 'varchar', length: 50 })
  id?: string;
}
