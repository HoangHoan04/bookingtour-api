import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from '../blog.service';

@ApiTags('User - Blog')
@Controller('blog')
export class UserBlogController {
  constructor(private readonly service: BlogService) {}
}
