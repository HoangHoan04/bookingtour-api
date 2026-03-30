import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TourPriceService } from '../tour-price.service';
import { CreateTourPriceDto, UpdateTourPriceDto } from '../dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';

@Controller('tour-prices')
export class AdminTourPriceController {
  constructor(private readonly tourPriceService: TourPriceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() dto: CreateTourPriceDto, @CurrentUser() user) {
    return this.tourPriceService.create(dto, user);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTourPriceDto,
    @CurrentUser() user,
  ) {
    return this.tourPriceService.update(id, dto, user);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourPriceService.remove(id);
  }
}
