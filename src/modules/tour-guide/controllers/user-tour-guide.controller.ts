import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto, SlugDto } from 'src/dto';
import { TourGuideService } from '../tour-guide.service';

@ApiTags('User - TourGuide')
@Controller('tour-guide')
export class UserTourGuideController {
  constructor(private readonly service: TourGuideService) {}

  @ApiOperation({ summary: 'Lấy danh sách hướng dẫn viên có phân trang' })
  @Post('pagination')
  async pagination(@Body() data: PaginationDto) {
    return await this.service.findAll(data);
  }

  @ApiOperation({ summary: 'Chi tiết hướng dẫn viên' })
  @Post('find-by-slug')
  async findBySlug(@Body() body: SlugDto) {
    return await this.service.findBySlug(body.slug);
  }
}
