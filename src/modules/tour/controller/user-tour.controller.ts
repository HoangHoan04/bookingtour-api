import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdDto, PaginationDto } from 'src/dto';
import { TourService } from '../tour.service';

@ApiTags('User - Tours')
@Controller('tour')
export class UserTourController {
  constructor(private readonly service: TourService) {}

  @ApiOperation({ summary: 'Lấy chi tiết tour theo ID' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }

  @ApiOperation({ summary: 'Lấy chi tiết tour theo slug (tự động tăng view)' })
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findTourBySlug(slug);
  }

  @ApiOperation({ summary: 'Lấy tất cả tours đang active' })
  @Get('active')
  async getActiveTours() {
    return await this.service.findActiveTours();
  }

  @ApiOperation({ summary: 'Phân trang tours' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  // ==================== SEARCH & FILTER ====================

  @ApiOperation({ summary: 'Tìm kiếm tours' })
  @Post('search')
  async searchTours(
    @Body()
    params: {
      keyword?: string;
      location?: string;
      category?: string;
      tags?: string[];
      minRating?: number;
      maxRating?: number;
      sortBy?: 'rating' | 'viewCount' | 'bookingCount' | 'createdAt';
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    },
  ) {
    // Chỉ cho phép search tours active
    return await this.service.searchTours({
      ...params,
      status: 'ACTIVE',
    });
  }

  @ApiOperation({ summary: 'Lấy tours theo category' })
  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return await this.service.findByCategory(category);
  }

  @ApiOperation({ summary: 'Lấy tours theo location' })
  @Post('find-by-location')
  async findByLocation(@Body() body: { location: string }) {
    return await this.service.findByLocation(body.location);
  }

  @ApiOperation({ summary: 'Lấy tours theo tags' })
  @Post('find-by-tags')
  async findByTags(@Body() body: { tags: string[] }) {
    return await this.service.findByTags(body.tags);
  }

  @ApiOperation({ summary: 'Lấy tours theo khoảng giá' })
  @Post('find-by-price-range')
  async findByPriceRange(@Body() body: { minPrice: number; maxPrice: number }) {
    return await this.service.getToursByPriceRange(
      body.minPrice,
      body.maxPrice,
    );
  }

  // ==================== POPULAR & FEATURED TOURS ====================

  @ApiOperation({ summary: 'Lấy tours phổ biến nhất' })
  @Get('popular')
  async getPopularTours(@Query('limit') limit?: number) {
    return await this.service.getPopularTours(limit || 10);
  }

  @ApiOperation({ summary: 'Lấy tours được đánh giá cao nhất' })
  @Get('top-rated')
  async getTopRatedTours(@Query('limit') limit?: number) {
    return await this.service.getTopRatedTours(limit || 10);
  }

  @ApiOperation({ summary: 'Lấy tours mới nhất' })
  @Get('newest')
  async getNewestTours(@Query('limit') limit?: number) {
    return await this.service.getNewestTours(limit || 10);
  }

  @ApiOperation({ summary: 'Lấy tours được đặt nhiều nhất' })
  @Get('most-booked')
  async getMostBookedTours(@Query('limit') limit?: number) {
    return await this.service.getMostBookedTours(limit || 10);
  }

  @ApiOperation({ summary: 'Lấy tours liên quan' })
  @Get('related/:id')
  async getRelatedTours(
    @Param('id') id: string,
    @Query('limit') limit?: number,
  ) {
    return await this.service.getRelatedTours(id, limit || 5);
  }

  // ==================== UTILITY & METADATA ====================

  @ApiOperation({ summary: 'Lấy tất cả categories' })
  @Get('categories')
  async getAllCategories() {
    return await this.service.getAllCategories();
  }

  @ApiOperation({ summary: 'Lấy tất cả locations' })
  @Get('locations')
  async getAllLocations() {
    return await this.service.getAllLocations();
  }

  @ApiOperation({ summary: 'Lấy tất cả tags' })
  @Get('tags')
  async getAllTags() {
    return await this.service.getAllTags();
  }

  @ApiOperation({ summary: 'Lấy selectbox tour (cho booking form)' })
  @Get('select-box')
  async selectBox() {
    return await this.service.selectBoxTour();
  }
}
