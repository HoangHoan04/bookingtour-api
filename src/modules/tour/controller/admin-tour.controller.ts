import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { CreateTourDto, UpdateTourDto } from '../dto';
import { TourService } from '../tour.service';

@ApiTags('Admin - Tours')
@Controller('tours')
export class AdminTourController {
  constructor(private readonly tourService: TourService) {}

  @Post('create')
  create(@Body() dto: CreateTourDto, @CurrentUser() user) {
    return this.tourService.createTour(dto, user);
  }

  @Post('update')
  update(@Body() dto: UpdateTourDto, @CurrentUser() user) {
    return this.tourService.update(dto, user);
  }
}
