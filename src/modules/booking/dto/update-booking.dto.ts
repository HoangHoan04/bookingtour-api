import { ApiProperty } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { Column } from 'typeorm';

export class UpdateBookingDto extends CreateBookingDto {
  @ApiProperty({ description: 'Id của đơn đặt tour' })
  @Column({ type: 'varchar', length: 50 })
  id?: string;
}
