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
import { PaginationDto } from 'src/dto/pagination.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('tour-prices')
export class AdminTourPriceController {
  constructor(private readonly tourPriceService: TourPriceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(@Body() dto: CreateTourPriceDto, @CurrentUser() user) {
    return this.tourPriceService.create(dto, user);
  }

  @ApiOperation({ summary: 'Phân trang giá tour' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.tourPriceService.pagination(data);
  }

  @ApiOperation({ summary: 'Lấy thông tin giá tour theo ID' })
  @Post('find-by-id')
  async findOne(@Body('id') id: string) {
    return await this.tourPriceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update')
  update(
    @Body('id') id: string,
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
