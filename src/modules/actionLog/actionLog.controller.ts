import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards';
import { PaginationDto } from '../../dto';
import { ActionLogService } from './actionLog.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('ActionLog')
@Controller('action-log')
export class ActionLogController {
  constructor(private readonly service: ActionLogService) {}

  @ApiOperation({ summary: 'Hàm phân trang' })
  @Post('pagination')
  public async pagination(@Body() data: PaginationDto) {
    return this.service.pagination(data);
  }
}
