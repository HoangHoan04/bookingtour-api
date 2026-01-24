import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  SubscribeNewsletterDto,
  UnsubscribeNewsletterDto,
} from './dto/newsletter.dto';
import { NewsletterService } from './newsletter.service';

@ApiTags('User - Newsletter')
@Controller('newsletter')
export class UserNewsletterController {
  constructor(private readonly service: NewsletterService) {}

  @ApiOperation({ summary: 'Đăng ký nhận tin tức' })
  @Post('subscribe')
  public async subscribe(@Body() dto: SubscribeNewsletterDto) {
    return await this.service.subscribe(dto);
  }

  @ApiOperation({ summary: 'Hủy đăng ký nhận tin tức' })
  @Post('unsubscribe')
  public async unsubscribe(@Body() dto: UnsubscribeNewsletterDto) {
    return await this.service.unsubscribe(dto);
  }

  @ApiOperation({ summary: 'Lấy danh sách email đã đăng ký (Admin)' })
  @Get('list')
  public async getAll() {
    return await this.service.getAll();
  }

  @ApiOperation({ summary: 'Đếm số lượng email đã đăng ký (Admin)' })
  @Post('count')
  public async getCount() {
    const count = await this.service.getCount();
    return { count };
  }
}
