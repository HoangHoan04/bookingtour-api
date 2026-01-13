import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({
    description: 'Điều kiện lọc',
    example: { code: 'xxxx', name: 'xxx xxxx xxxx' },
  })
  where: any;
  @ApiProperty({ description: 'Số record bỏ qua', example: 0 })
  skip: number;
  @ApiProperty({ description: 'Số record lấy', example: 10 })
  take: number;
}
