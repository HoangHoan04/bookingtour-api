import { Controller } from '@nestjs/common';
import { TourService } from '../tour.service';
import { Post, Body, Param, Put } from '@nestjs/common';
import { CreateTourDto, UpdateTourDto } from '../dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Tours')
@Controller('tours')
export class AdminTourController {
  constructor(private readonly tourService: TourService) {}
  @Post()
  create(@Body() dto: CreateTourDto) {
    return this.tourService.createTour(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTourDto) {
    return this.tourService.update(id, dto);
  }
}
