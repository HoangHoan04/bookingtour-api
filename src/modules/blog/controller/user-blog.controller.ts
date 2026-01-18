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

  @ApiOperation({ summary: 'Lấy danh sách bình luận của bài viết' })
  @Post('get-blog-comments-by-post')
  async getCommentsByPostId(@Body() body: { postId: string } & PaginationDto) {
    return await this.service.getBlogCommentsByPostId(body.postId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo bình luận mới' })
  @Post('create-blog-comment')
  async createBlogComment(
    @Body() data: CreateCommentDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.createBlogComment(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Sửa bình luận của mình' })
  @Post('update-blog-comment')
  async updateBlogComment(
    @Body() body: { id: string } & UpdateCommentDto,
    @CurrentUser() user: UserDto,
  ) {
    return await this.service.updateBlogComment(body.id, body, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa bình luận của mình' })
  @Post('delete-blog-comment')
  async deleteBlogComment(@Body() body: IdDto, @CurrentUser() user: UserDto) {
    return await this.service.deleteBlogComment(body.id, user);
  }
}
