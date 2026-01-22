import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileArchivalRepository } from 'src/repositories';
import {
  BlogCommentRepository,
  BlogPostRepository,
} from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../file-archival/file-archival.module';
import { BlogService } from './blog.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BlogPostRepository,
      BlogCommentRepository,
      FileArchivalRepository,
    ]),
    ActionLogModule,
    FileArchivalModule,
  ],
  exports: [BlogService],
  controllers: [],
  providers: [BlogService],
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
