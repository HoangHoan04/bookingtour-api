import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards';
import { PaginationDto, UserDto } from 'src/dto';
import { ChatbotService } from './chatbot.service';
import { ChatQueryDto } from './dto';

class SearchHistoryDto {
  @ApiProperty()
  searchTerm: string;
}

class DeleteHistoryDto {
  @ApiProperty()
  id: string;
}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('AI Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @ApiOperation({
    summary: 'AI HR Chatbot – hỏi đáp, phân tích & tư vấn nhân sự',
  })
  @Post('chat')
  async chat(@CurrentUser() user: UserDto, @Body() body: ChatQueryDto) {
    return this.chatbotService.chat(user, body.query);
  }

  @ApiOperation({ summary: 'Thống kê AI Chatbot (Tổng quan hệ thống)' })
  @Post('stats')
  async getStats() {
    return this.chatbotService.getStats();
  }

  @ApiOperation({ summary: 'Lấy lịch sử chat của user (phân trang)' })
  @Post('history')
  async getHistory(@CurrentUser() user: UserDto, @Body() body: PaginationDto) {
    return this.chatbotService.getChatHistory(user.id);
  }

  @ApiOperation({ summary: 'Tìm kiếm trong lịch sử chat' })
  @Post('history/search')
  async searchHistory(
    @CurrentUser() user: UserDto,
    @Body() body: SearchHistoryDto,
  ) {
    return this.chatbotService.searchChatHistory(user.id, body.searchTerm);
  }

  @ApiOperation({ summary: 'Lấy thống kê lịch sử chat cá nhân' })
  @Post('history/stats')
  async getHistoryStats(@CurrentUser() user: UserDto) {
    return this.chatbotService.getChatHistoryStats(user.id);
  }

  @ApiOperation({ summary: 'Xóa tất cả lịch sử hội thoại AI' })
  @Post('clear-history')
  async clearHistory(@CurrentUser() user: UserDto) {
    return this.chatbotService.clearChatHistory(user.id);
  }

  @ApiOperation({ summary: 'Xóa 1 câu hỏi cụ thể trong lịch sử' })
  @Post('history/delete-item')
  async deleteHistoryItem(
    @CurrentUser() user: UserDto,
    @Body() body: DeleteHistoryDto,
  ) {
    return this.chatbotService.deleteChatHistoryItem(user.id, body.id);
  }
}
