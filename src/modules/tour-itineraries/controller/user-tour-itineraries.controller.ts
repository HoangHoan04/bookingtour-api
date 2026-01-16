import { Controller } from '@nestjs/common';
import { TourItinerarieService } from '../tour-inineraries.service';
import { Get, Param } from '@nestjs/common';

@Controller('tour-itineraries')
export class UserTourItinerariesController {
  constructor(private readonly service: TourItinerarieService) {}

  @Get('tour-detail/:tourDetailId')
  findByTourDetail(@Param('tourDetailId') id: string) {
    return this.service.findByTourDetail(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
