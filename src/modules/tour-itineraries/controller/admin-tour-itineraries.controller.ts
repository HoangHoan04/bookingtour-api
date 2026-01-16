import { Controller } from '@nestjs/common';
import { TourItinerarieService } from '../tour-inineraries.service';
import { Body, Post, Put, Param, Get, Delete } from '@nestjs/common';
import { CreateTourItinerarieDto, UpdateTourItinerarieDto } from '../dto';

@Controller('tour-itineraries')
export class AdminTourItinerariesController {
  constructor(private readonly service: TourItinerarieService) {}
  @Post()
  create(@Body() dto: CreateTourItinerarieDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTourItinerarieDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
