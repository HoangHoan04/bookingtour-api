import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BannerService } from '../banner.service';
import { GetBannerDto } from '../dto/get-by-type.dto';

@Controller('banner')
@ApiTags('User - Banner')
export class UserBannerController {
  constructor(private readonly service: BannerService) {}

  @Post('get-by-type')
  @ApiOperation({ summary: 'Lấy danh sách banner theo loại' })
  async findByType(@Body() dto: GetBannerDto) {
    if (dto.type) {
      return this.service.findByType(dto.type);
    }
    return this.service.findAll();
  }
}
