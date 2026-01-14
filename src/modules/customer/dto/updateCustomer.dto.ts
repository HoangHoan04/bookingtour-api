import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateCustomerDto } from './createCustomer.dto';

export class UpdateCustomerDto extends CreateCustomerDto {
  @ApiProperty({ description: 'ID khách hàng' })
  id: string;
}

export class UpdateCustomerAvatarDto {
  @ApiProperty({ description: 'url avatar' })
  @IsString()
  avatarUrl: string;
}
