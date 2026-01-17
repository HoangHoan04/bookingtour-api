import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IdDto } from 'src/dto/id.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { TourService } from '../tour.service';

@Controller('tours')
export class UserTourController {
  constructor(private readonly service: TourService) {}

  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết tour' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findOne(body.id);
  }
}
