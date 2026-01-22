import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdDto, PaginationDto } from 'src/dto';
import { NewsService } from '../news.service';

@ApiTags('User - News')
@Controller('news')
export class UserNewsController {
  constructor(private readonly service: NewsService) {}

  @ApiOperation({ summary: 'Lấy danh sách tin tức công khai' })
  @Post('pagination')
  async getPublicNews(@Body() body: PaginationDto) {
    return await this.service.getPublicNews(body);
  }

  @ApiOperation({ summary: 'Xem chi tiết tin tức công khai' })
  @Post('detail')
  async getPublicNewsById(@Body() body: IdDto) {
    return await this.service.getPublicNewsById(body.id);
  }

  @ApiOperation({ summary: 'Lấy danh sách tin tức nổi bật' })
  @Post('featured')
  async getFeaturedNews(@Body() body: PaginationDto) {
    return await this.service.getFeaturedNews(body.take);
  }

  @ApiOperation({ summary: 'Lấy tin tức liên quan' })
  @Post('related')
  async getRelatedNews(@Body() body: { id: string; limit?: number }) {
    const newsLimit = body.limit ? Number(body.limit) : 4;
    return await this.service.getRelatedNews(body.id, newsLimit);
  }

  @ApiOperation({ summary: 'Lấy tin tức mới nhất' })
  @Post('latest')
  async getLatestNews(@Body() body: PaginationDto) {
    return await this.service.getLatestNews(body.take);
  }

  @ApiOperation({ summary: 'Lấy tin tức theo loại' })
  @Post('find-by-type')
  async getNewsByType(@Body() body: { type: string } & PaginationDto) {
    return await this.service.getNewsByType(body.type, body);
  }

  @ApiOperation({ summary: 'Tìm kiếm tin tức công khai' })
  @Post('search')
  async searchPublicNews(@Body() body: { keyword: string } & PaginationDto) {
    return await this.service.searchPublicNews(body.keyword, body);
  }

  @ApiOperation({ summary: 'Lấy số lượng tin tức theo từng loại' })
  @Post('count-by-type')
  async getNewsCountByType() {
    return await this.service.getNewsCountByType();
  }
}
