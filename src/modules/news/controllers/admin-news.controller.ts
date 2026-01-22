import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { FilterCustomerDto } from 'src/modules/customer/dto/filterCustomer.dto';
import { CreateNewsDto, UpdateNewsDto } from '../dto';
import { NewsService } from '../news.service';

@ApiBearerAuth()
@ApiTags('Admin - News')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('news')
export class AdminNewsController {
  constructor(private readonly service: NewsService) {}

  @ApiOperation({ summary: 'Tạo mới tin tức' })
  @Post('create')
  async create(@Body() data: CreateNewsDto, @CurrentUser() user: UserDto) {
    return await this.service.create(data, user);
  }

  @ApiOperation({ summary: 'Lấy danh sách tin tức với bộ lọc (Admin)' })
  @Post('pagination')
  async pagination(@Body() body: PaginationDto<FilterCustomerDto>) {
    return await this.service.pagination(body);
  }

  @ApiOperation({ summary: 'Lấy danh sách tin tức cho select box' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Cập nhật thông tin tin tức' })
  @Post('update')
  async update(@Body() data: UpdateNewsDto, @CurrentUser() user: UserDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động tin tức' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt tin tức' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, body.id);
  }

  @ApiOperation({ summary: 'Chi tiết tin tức (Admin)' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }

  @ApiOperation({ summary: 'Lấy số lượng tin tức theo loại' })
  @Post('count-by-type')
  async getNewsCountByType() {
    return await this.service.getNewsCountByType();
  }

  @ApiOperation({ summary: 'Tìm kiếm tin tức theo IDs' })
  @Post('find-by-ids')
  async findByIds(@Body() body: { ids: string[] }) {
    const news = await this.service.findByIds(body.ids);
    return {
      message: 'Tìm kiếm tin tức thành công',
      data: news,
      total: news.length,
    };
  }
}
