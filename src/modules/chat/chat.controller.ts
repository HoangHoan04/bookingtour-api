import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { UserDto } from 'src/dto';
import { ChatService } from './chat.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Chat & Call')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Lấy danh sách phòng chat của người dùng hiện tại' })
  @Post('rooms/pagination')
  async getUserRooms(@CurrentUser() user: UserDto) {
    const data = await this.chatService.getUserChatRooms(user.id);
    return { data, success: true };
  }

  @ApiOperation({ summary: 'Lấy chi tiết phòng chat và thành viên' })
  @Post('rooms/find-by-id')
  async getRoomDetails(@Body() data: { roomId: string }) {
    const result = await this.chatService.getChatRoomWithMembers(data.roomId);
    return { data: result, success: true };
  }

  @ApiOperation({ summary: 'Tạo hoặc lấy phòng chat 1-1' })
  @Post('rooms/direct/create')
  async createDirectRoom(
    @CurrentUser() user: UserDto,
    @Body() body: { recipientId: string },
  ) {
    const data = await this.chatService.createDirectChatRoom(
      user.id,
      body.recipientId,
    );
    return { data, success: true, message: 'Khởi tạo phòng chat thành công' };
  }

  @ApiOperation({ summary: 'Lấy danh sách tin nhắn trong phòng' })
  @Post('messages/pagination')
  async getMessages(
    @Body() body: { roomId: string; limit?: number; offset?: number },
  ) {
    const data = await this.chatService.getMessages(
      body.roomId,
      body.limit || 50,
      body.offset || 0,
    );
    return { data, success: true };
  }

  @ApiOperation({ summary: 'Chỉnh sửa tin nhắn' })
  @Post('messages/edit')
  async editMessage(
    @CurrentUser() user: UserDto,
    @Body() body: { messageId: string; content: string },
  ) {
    await this.chatService.editMessage(body.messageId, user.id, body.content);
    return { success: true, message: 'Cập nhật tin nhắn thành công' };
  }

  @ApiOperation({ summary: 'Lấy lịch sử cuộc gọi' })
  @Post('calls/history')
  async getCallHistory(
    @CurrentUser() user: UserDto,
    @Body() body: { limit?: number },
  ) {
    const data = await this.chatService.getCallHistory(
      user.id,
      body.limit || 20,
    );
    return { data, success: true };
  }

  @ApiOperation({ summary: 'Lấy tổng số tin nhắn chưa đọc' })
  @Get('messages/unread-count')
  async getUnreadCount(@CurrentUser() user: UserDto) {
    const count = await this.chatService.getUnreadMessageCount(user.id);
    return { data: count, success: true };
  }

  @ApiOperation({ summary: 'Đánh dấu phòng chat là đã đọc' })
  @Post('rooms/mark-read')
  async markRoomRead(
    @CurrentUser() user: UserDto,
    @Body() body: { roomId: string },
  ) {
    await this.chatService.markRoomAsRead(body.roomId, user.id);
    return { success: true };
  }
}
