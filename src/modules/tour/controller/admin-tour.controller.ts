import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { CreateTourDto, UpdateTourDto } from '../dto';
import { TourService } from '../tour.service';

@ApiTags('Admin - Tours')
@Controller('tour')
@UseGuards(JwtAuthGuard)
export class AdminTourController {
  constructor(private readonly service: TourService) {}

  @ApiOperation({ summary: 'Tạo mới tour' })
  @Post('create')
  async create(@Body() data: CreateTourDto, @CurrentUser() user: UserDto) {
    return await this.service.createTour(data, user);
  }

  @ApiOperation({ summary: 'Cập nhật tour' })
  @Post('update')
  async update(@Body() data: UpdateTourDto, @CurrentUser() user: UserDto) {
    return await this.service.updateTour(data, user);
  }

  @ApiOperation({ summary: 'Chi tiết tour' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }

  @ApiOperation({ summary: 'Tìm tour theo code' })
  @Post('find-by-code')
  async findByCode(@Body() body: { code: string }) {
    return await this.service.findByCode(body.code);
  }

  @ApiOperation({ summary: 'Lấy tất cả tours' })
  @Get('all')
  async findAll(@Query('includeDeleted') includeDeleted?: boolean) {
    return await this.service.findAll(includeDeleted);
  }

  @ApiOperation({ summary: 'Phân trang tours với filter' })
  @Post('pagination')
  async pagination(@Body() body: PaginationDto) {
    return await this.service.pagination(body);
  }

  // ==================== STATUS MANAGEMENT ====================

  @ApiOperation({ summary: 'Kích hoạt tour' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activateTour(user, body.id);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động tour' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivateTour(user, body.id);
  }

  @ApiOperation({ summary: 'Thay đổi trạng thái tour' })
  @Post('change-status')
  async changeStatus(
    @Body() body: { id: string; status: string },
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.changeStatus(body.id, body.status, user);
  }

  @ApiOperation({ summary: 'Cập nhật rating và review count' })
  @Post('update-rating-stats')
  async updateRatingStats(@Body() body: IdDto) {
    return await this.service.updateRatingStats(body.id);
  }

  // ==================== SEARCH & FILTER ====================

  @ApiOperation({ summary: 'Tìm kiếm tours nâng cao' })
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
      status?: string;
      sortBy?: 'rating' | 'viewCount' | 'bookingCount' | 'createdAt';
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    },
  ) {
    return await this.service.searchTours(params);
  }

  @ApiOperation({ summary: 'Lấy tours theo category' })
  @Post('find-by-category')
  async findByCategory(@Body() body: { category: string }) {
    return await this.service.findByCategory(body.category);
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

  // ==================== UTILITY ====================

  @ApiOperation({ summary: 'Lấy selectbox tour' })
  @Get('select-box')
  async selectBox() {
    return await this.service.selectBoxTour();
  }

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

  @ApiOperation({ summary: 'Kiểm tra tour tồn tại' })
  @Post('exists')
  async exists(@Body() body: IdDto) {
    return await this.service.exists(body.id);
  }

  @ApiOperation({ summary: 'Kiểm tra slug tồn tại' })
  @Post('check-slug')
  async checkSlug(@Body() body: { slug: string; excludeId?: string }) {
    return await this.service.isSlugExists(body.slug, body.excludeId);
  }

  @ApiOperation({ summary: 'Generate slug unique' })
  @Post('generate-slug')
  async generateSlug(@Body() body: { title: string; excludeId?: string }) {
    return await this.service.generateUniqueSlug(body.title, body.excludeId);
  }
}
