import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, PermissionGuard } from 'src/common/guards';
import { NewsService } from '../news.service';

@ApiBearerAuth()
@ApiTags('Admin - News')
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('news')
export class AdminNewsController {
  constructor(private readonly newsService: NewsService) {}
}
