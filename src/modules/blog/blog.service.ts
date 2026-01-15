import { Injectable } from '@nestjs/common';
import {
  BlogCommentRepository,
  BlogPostRepository,
} from 'src/repositories/blog.repository';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogPostRepo: BlogPostRepository,
    private readonly blogCommentRepo: BlogCommentRepository,
  ) {}
}
