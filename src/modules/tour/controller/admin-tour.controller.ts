import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { CreateTourDto, UpdateTourDto } from '../dto';
import { TourService } from '../tour.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Admin - Tours')
@Controller('tours')
export class AdminTourController {
  constructor(private readonly tourService: TourService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateTourDto, @CurrentUser() user) {
    return this.tourService.createTour(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update')
  update(@Body() dto: UpdateTourDto, @CurrentUser() user) {
    return this.tourService.update(dto, user);
  }
}
