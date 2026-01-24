import { Controller, UseGuards } from '@nestjs/common';
import { TourItinerarieService } from '../tour-inineraries.service';
import { Body, Post, Put, Param, Get, Delete } from '@nestjs/common';
import { CreateTourItinerarieDto, UpdateTourItinerarieDto } from '../dto';
import { JwtAuthGuard } from 'src/common/guards';
import { CurrentUser } from 'src/common/decorators';

@Controller('tour-itineraries')
export class AdminTourItinerariesController {
  constructor(private readonly service: TourItinerarieService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() dto: CreateTourItinerarieDto, @CurrentUser() user) {
    return this.service.create(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTourItinerarieDto,
    @CurrentUser() user,
  ) {
    return this.service.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
