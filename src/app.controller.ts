import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller({ path: '/', version: '1.00' })
export class AppController {
  @Post()
  root() {
    return { message: 'API is running' };
  }
}
