import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { BlogService } from '../blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto';

@ApiTags('Admin - Blog')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('blog')
export class AdminBlogController {
  constructor(private readonly service: BlogService) {}

  @ApiOperation({ summary: 'Tạo mới bài viết' })
  @Post('create')
  async create(@Body() data: CreateBlogDto, @CurrentUser() user: UserDto) {}

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách bài viết với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterBlogDto>) {}

  @Post('select-box')
  async selectBox() {}

  @ApiOperation({ summary: 'Cập nhật thông tin bài viết' })
  @Post('update')
  async update(@Body() data: UpdateBlogDto, @CurrentUser() user: UserDto) {}

  @ApiOperation({ summary: 'Ngưng hoạt động bài viết' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {}

  @ApiOperation({ summary: 'Kích hoạt bài viết' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {}

  @ApiOperation({ summary: 'Chi tiết bài viết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {}
}
