import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TourPriceService } from '../tour-price.service';
import { Get, Param } from '@nestjs/common';

@ApiTags('tour-prices')
@Controller('tour-prices')
export class UserTourPriceController {
  constructor(private readonly tourPriceService: TourPriceService) {}

  @Get('tour-detail/:tourDetailId')
  findByTourDetail(@Param('tourDetailId') id: string) {
    return this.tourPriceService.findByTourDetail(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourPriceService.findOne(id);
  }
}
