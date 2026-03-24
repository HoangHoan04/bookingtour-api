import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TourDetailService } from '../tour-detail.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { IdDto, TourIdDto } from 'src/dto';

@ApiTags('User - Tour Details')
@Controller('tour-detail')
export class UserTourDetailController {
  constructor(private readonly tourDetailService: TourDetailService) {}

  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.tourDetailService.pagination(data);
  }

  @ApiOperation({ summary: 'Chi tiết tour ' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.tourDetailService.findById(body.id);
  }

  @Post('find-by-tour')
  @ApiOperation({ summary: 'Lấy chi tiết tour theo tourId' })
  async findByTour(@Body() body: TourIdDto) {
    return await this.tourDetailService.findByTour(body.tourId);
  }
}
