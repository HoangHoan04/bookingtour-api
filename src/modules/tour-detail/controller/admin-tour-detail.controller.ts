import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TourDetailService } from '../tour-detail.service';
import { CreateTourDetailDto } from '../dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Admin - Tour Details')
@Controller('tour-details')
export class AdminTourDetailController {
  constructor(private readonly tourDetailService: TourDetailService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() dto: CreateTourDetailDto, @CurrentUser() user) {
    return this.tourDetailService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update')
  update(@Body() dto, @CurrentUser() user) {
    return this.tourDetailService.update(dto.id, dto, user);
  }
}
