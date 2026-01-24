import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TourDetailService } from '../tour-detail.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { IdDto } from 'src/dto';

@ApiTags('User - Tour Details')
@Controller('tour-details')
export class UserTourDetailController {
  constructor(private readonly tourDetailService: TourDetailService) {}

  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.tourDetailService.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết tour ' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.tourDetailService.findOne(body.id);
  }
}
