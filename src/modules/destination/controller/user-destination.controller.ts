import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterSlugDto, IdDto, PaginationDto, SlugDto } from 'src/dto';
import { DestinationService } from '../destination.service';
import { FilterDestinationDto } from '../dto';

@ApiTags('User - Destination')
@Controller('destination')
export class UserDestinationController {
  constructor(private readonly service: DestinationService) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách điểm đến với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterDestinationDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Chi tiết điểm đến theo slug' })
  @Post('find-by-slug')
  async findBySlug(@Body() body: SlugDto) {
    return await this.service.findBySlug(body.slug);
  }

  @ApiOperation({ summary: 'Lấy danh sách tour theo điểm đến' })
  @Post('get-tours-by-destination')
  async getToursByDestination(@Body() body: IdDto) {
    return await this.service.getToursByDestination(body.id);
  }

  @ApiOperation({ summary: 'Tăng lượt xem điểm đến' })
  @Post('increment-view')
  async incrementViewCount(@Body() body: IdDto) {
    return await this.service.incrementViewCount(body.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách điểm đến phổ biến' })
  @Post('popular')
  async getPopularDestinations(@Body() body?: { limit?: number }) {
    return await this.service.getPopularDestinations(body?.limit || 10);
  }

  @ApiOperation({ summary: 'Tìm kiếm điểm đến theo từ khóa' })
  @Post('search')
  async searchDestinations(@Body() body: { keyword: string }) {
    return await this.service.searchDestinations(body.keyword);
  }
}
