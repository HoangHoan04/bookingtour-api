import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsService } from '../news.service';

@ApiTags('User - News')
@Controller('news')
export class UserNewsController {
  constructor(private readonly service: NewsService) {}
}
