import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { PaginationDto, UserDto } from 'src/dto';
import { NotificationService } from './notification.service';

@ApiTags('Notify')
@UseGuards(JwtAuthGuard)
@Controller('notify')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post('update-seen-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả là đã đọc' })
  async updateSeenAll(@CurrentUser() user: UserDto) {
    return await this.service.updateSeenAll(user);
  }

  @Post('update-seen-list')
  @ApiOperation({ summary: 'Đánh dấu danh sách thông báo là đã đọc' })
  async updateSeenListNotify(
    @CurrentUser() user: UserDto,
    @Body() body: { lstId: string[] },
  ) {
    return await this.service.updateSeenListNotify(user, body);
  }

  @Post('find-count-notify-not-seen')
  @ApiOperation({ summary: 'Tìm số thông báo chưa đọc' })
  async findCountNotiNotSeen(@CurrentUser() user: UserDto) {
    return await this.service.findCountNotiNotSeen(user);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách với bộ lọc' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  async pagination(@CurrentUser() user: UserDto, @Body() body: PaginationDto) {
    return await this.service.pagination(user, body);
  }
}
