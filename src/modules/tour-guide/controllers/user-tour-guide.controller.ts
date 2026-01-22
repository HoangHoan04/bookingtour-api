import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/dto';
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

  @ApiOperation({ summary: 'Chi tiết banner' })
  @Post('find-by-slug')
  async findBySlug(@Body() slug: string) {
    return await this.service.findBySlug(slug);
  }
}
