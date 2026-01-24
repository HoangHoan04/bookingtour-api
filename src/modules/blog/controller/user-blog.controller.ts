import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { IdDto, PaginationDto, UserDto } from 'src/dto';
import { BlogService } from '../blog.service';
import { CreateCommentDto, UpdateCommentDto } from '../dto';

@ApiTags('User - Blog')
@Controller('blog')
export class UserBlogController {
  constructor(private readonly service: BlogService) {}

  @ApiOperation({ summary: 'Lấy danh sách bài viết đã xuất bản' })
  @Post('pagination')
  async getPublishedBlogs(@Body() data: PaginationDto) {
    return await this.service.getPublishedBlogs(data);
  }

  @ApiOperation({ summary: 'Lấy chi tiết bài viết theo slug' })
  @Post('detail')
  async getBlogBySlug(@Body() body: { slug: string }) {
    return await this.service.getPublishedBlogBySlug(body.slug);
  }

  @ApiOperation({ summary: 'Lấy bài viết liên quan' })
  @Post('related')
  async getRelatedBlogs(@Body() body: { id: string; limit?: number }) {
    return await this.service.getRelatedBlogs(body.id, body.limit || 5);
  }

  @ApiOperation({ summary: 'Lấy danh sách bài viết phổ biến' })
  @Post('popular')
  async getPopularBlogs(@Body() body: { limit?: number }) {
    return await this.service.getPopularBlogs(body.limit || 10);
  }

  @ApiOperation({ summary: 'Lấy danh sách bài viết mới nhất' })
  @Post('latest')
  async getLatestBlogs(@Body() body: { limit?: number }) {
    return await this.service.getLatestBlogs(body.limit || 10);
  }

  @ApiOperation({ summary: 'Tìm kiếm bài viết' })
  @Post('search')
  async searchBlogs(@Body() body: { keyword: string } & PaginationDto) {
    return await this.service.searchBlogs(body.keyword, body);
  }

  @ApiOperation({ summary: 'Lấy bài viết theo category' })
  @Post('by-category')
  async getBlogsByCategory(@Body() body: { category: string } & PaginationDto) {
    return await this.service.getBlogsByCategory(body.category, body);
  }

  @ApiOperation({ summary: 'Lấy bài viết theo tag' })
  @Post('by-tag')
  async getBlogsByTag(@Body() body: { tag: string } & PaginationDto) {
    return await this.service.getBlogsByTag(body.tag, body);
  }

  @ApiOperation({ summary: 'Lấy danh sách categories' })
  @Post('categories')
  async getCategories() {
    return await this.service.getCategories();
  }

  @ApiOperation({ summary: 'Lấy danh sách tags' })
  @Post('tags')
  async getTags() {
    return await this.service.getTags();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Thích bài viết' })
  @Post('like')
  async likeBlog(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.likeBlog(body.id, user);
  }

  // ==================== BLOG COMMENTS ====================

  @ApiOperation({ summary: 'Lấy danh sách bình luận của bài viết' })
  @Post('comments/by-post')
  async getCommentsByPostId(@Body() body: { postId: string } & PaginationDto) {
    return await this.service.getBlogCommentsByPostId(body.postId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo bình luận mới' })
  @Post('comments/create')
  async createBlogComment(
    @Body() data: CreateCommentDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.createBlogComment(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sửa bình luận của mình' })
  @Post('comments/update')
  async updateBlogComment(
    @Body() body: { id: string } & UpdateCommentDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updateBlogComment(body.id, body, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa bình luận của mình' })
  @Post('comments/delete')
  async deleteBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deleteBlogComment(body.id, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Khôi phục bình luận đã xóa' })
  @Post('comments/restore')
  async restoreBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.restoreBlogComment(body.id, user);
  }
}
