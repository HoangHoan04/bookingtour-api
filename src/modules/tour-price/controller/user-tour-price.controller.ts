import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TourPriceService } from '../tour-price.service';
import { Get, Param, Post } from '@nestjs/common';

@ApiTags('tour-prices')
@Controller('tour-prices')
export class UserTourPriceController {
  constructor(private readonly tourPriceService: TourPriceService) {}

  @Post('tour-detail/:tourDetailId')
  findByTourDetail(@Param('tourDetailId') id: string) {
    return this.tourPriceService.findByTourDetail(id);
  }

  @Post(':id')
  findOne(@Param('id') id: string) {
    return this.tourPriceService.findOne(id);
  }
}
