import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { BlogService } from '../blog.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto';

@ApiBearerAuth()
@ApiTags('Admin - Blog')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('admin/blog')
export class AdminBlogController {
  constructor(private readonly service: BlogService) {}

  @ApiOperation({ summary: 'Lấy danh sách bài viết với bộ lọc' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.pagination(data);
  }

  @ApiOperation({ summary: 'Lấy danh sách bài viết cho select box' })
  @Post('select-box')
  async selectBox() {
    return await this.service.selectBox();
  }

  @ApiOperation({ summary: 'Chi tiết bài viết' })
  @Post('find-by-id')
  async findById(@Body() body: IdDto) {
    return await this.service.findById(body.id);
  }

  @ApiOperation({ summary: 'Tạo mới bài viết' })
  @Post('create')
  async create(@Body() data: CreateBlogDto, @CurrentUser() user: UserDto) {
    return await this.service.create(data, user);
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

  @ApiOperation({ summary: 'Lấy danh sách bình luận với bộ lọc' })
  @Post('comments/pagination')
  async paginationBlogComment(@Body() data: PaginationDto) {
    return await this.service.paginationBlogComment(data);
  }

  @ApiOperation({ summary: 'Chi tiết bình luận' })
  @Post('comments/find-by-id')
  async findBlogCommentById(@Body() body: IdDto) {
    return await this.service.findBlogCommentById(body.id);
  }

  @ApiOperation({ summary: 'Duyệt bình luận' })
  @Post('comments/approve')
  async approveBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.approveBlogComment(body.id, user);
  }

  @ApiOperation({ summary: 'Từ chối bình luận' })
  @Post('comments/reject')
  async rejectBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.rejectBlogComment(body.id, user);
  }

  @ApiOperation({ summary: 'Xóa bình luận' })
  @Post('comments/delete')
  async deleteBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deleteBlogComment(body.id, user);
  }

  @ApiOperation({ summary: 'Khôi phục bình luận đã xóa' })
  @Post('comments/restore')
  async restoreBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.restoreBlogComment(body.id, user);
  }
}
