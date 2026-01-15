import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { PaginationDto, UserDto } from 'src/dto';
import {
  MarkReadListDto,
  NotificationCreateDto,
  UpdateNotificationDto,
  UpdateNotificationSettingDto,
} from '../dto/notification.dto';
import { NotificationService } from '../notification.service';

@ApiTags('Admin - Notify')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('notify')
export class AdminNotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo thông báo gửi cho user' })
  async createNotification(
    @CurrentUser() user: UserDto,
    @Body() body: NotificationCreateDto,
  ) {
    return await this.service.createNotify(user.id, body);
  }

  @Post('update-seen-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả là đã đọc' })
  async updateSeenAll(@CurrentUser() user: UserDto) {
    return await this.service.updateSeenAll(user);
  }

  @Post('update-seen-list')
  @ApiOperation({ summary: 'Đánh dấu danh sách thông báo là đã đọc' })
  async updateSeenListNotify(
    @CurrentUser() user: UserDto,
    @Body() body: MarkReadListDto,
  ) {
    return await this.service.updateSeenListNotify(user, body);
  }

  @Post('find-count-notify-not-seen')
  @ApiOperation({ summary: 'Tìm số thông báo chưa đọc' })
  async findCountNotiNotSeen(@CurrentUser() user: UserDto) {
    return await this.service.findCountNotiNotSeen(user);
  }

  @Post('pagination')
  @ApiOperation({ summary: 'Lấy danh sách thông báo với phân trang và filter' })
  async pagination(@CurrentUser() user: UserDto, @Body() body: PaginationDto) {
    return await this.service.pagination(user, body);
  }

  @Post('detail/:id')
  @ApiOperation({ summary: 'Lấy chi tiết thông báo' })
  async getDetail(@CurrentUser() user: UserDto, @Param('id') id: string) {
    return await this.service.getNotificationDetail(user.id, id);
  }

  @Post('update/:id')
  @ApiOperation({ summary: 'Cập nhật thông báo (chỉ admin)' })
  async updateNotification(
    @CurrentUser() user: UserDto,
    @Param('id') id: string,
    @Body() body: UpdateNotificationDto,
  ) {
    return await this.service.updateNotification(user.id, id, body);
  }

  @Post('get-settings')
  @ApiOperation({ summary: 'Lấy cài đặt thông báo của user' })
  async getSettings(@CurrentUser() user: UserDto) {
    return await this.service.getSettings(user.id);
  }

  @Post('update-settings')
  @ApiOperation({ summary: 'Cập nhật cài đặt thông báo' })
  async updateSettings(
    @CurrentUser() user: UserDto,
    @Body() body: UpdateNotificationSettingDto,
  ) {
    return await this.service.updateSettings(user.id, body);
  }
}
