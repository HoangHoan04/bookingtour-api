import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { BlogService } from '../blog.service';
import {
  CreateBlogDto,
  FilterBlogDto,
  FilterCommentDto,
  UpdateBlogDto,
} from '../dto';

@ApiBearerAuth()
@ApiTags('Admin - Blog')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('blog')
export class AdminBlogController {
  constructor(private readonly service: BlogService) {}

  @ApiOperation({ summary: 'Tạo mới bài viết' })
  @Post('create')
  async create(@Body() data: CreateBlogDto, @CurrentUser() user: UserDto) {
    return await this.service.create(data, user);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách bài viết với bộ lọc' })
  async pagination(@Body() body: PaginationDto<FilterBlogDto>) {
    return await this.service.pagination(body);
  }

  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Cập nhật thông tin bài viết' })
  @Post('update')
  async update(@Body() data: UpdateBlogDto, @CurrentUser() user: UserDto) {
    return await this.service.update(data, user);
  }

  @ApiOperation({ summary: 'Ngưng hoạt động bài viết' })
  @Post('deactivate')
  async deactivate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deactivate(user, body.id);
  }

  @ApiOperation({ summary: 'Kích hoạt bài viết' })
  @Post('activate')
  async activate(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.activate(user, body.id);
  }

  @ApiOperation({ summary: 'Chi tiết bài viết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }

  @Post('pagination-blog-comment')
  @ApiOperation({ summary: 'Lấy danh sách bình luận với bộ lọc' })
  async paginationBlogComment(@Body() body: PaginationDto<FilterCommentDto>) {
    return await this.service.paginationBlogComment(body);
  }

  @ApiOperation({ summary: 'Chi tiết bình luận' })
  @Post('find-blog-comment-by-id')
  async findBlogCommentById(@Body() body: IdDto) {
    return await this.service.findBlogCommentById(body.id);
  }

  @ApiOperation({ summary: 'Xóa bình luận' })
  @Post('delete-blog-comment')
  async deleteBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deleteBlogComment(body.id, user);
  }

  @ApiOperation({ summary: 'Khôi phục bình luận đã xóa' })
  @Post('restore-blog-comment')
  async restoreBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.restoreBlogComment(body.id, user);
  }
}
