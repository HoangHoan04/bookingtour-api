import { Controller } from '@nestjs/common';
import { TourService } from '../tour.service';
import { Post, Body, Param, Put, Get } from '@nestjs/common';
import { CreateTourDto, UpdateTourDto } from '../dto';

@Controller('tours')
export class UserTourController {
  constructor(private readonly tourService: TourService) {}
  @Get()
  findAll() {
    return this.tourService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tourService.findOne(id);
  }
}
