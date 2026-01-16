import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { TourPriceService } from '../tour-price.service';
import { CreateTourPriceDto, UpdateTourPriceDto } from '../dto';

@Controller('tour-prices')
export class AdminTourPriceController {
  constructor(private readonly tourPriceService: TourPriceService) {}

  @Post()
  create(@Body() dto: CreateTourPriceDto) {
    return this.tourPriceService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTourPriceDto) {
    return this.tourPriceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tourPriceService.remove(id);
  }
}
