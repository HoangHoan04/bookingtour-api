import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  BlogCommentRepository,
  BlogPostRepository,
} from 'src/repositories/blog.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { ActionLogModule } from '../actionLog/actionLog.module';
import { FileArchivalModule } from '../fileArchival/fileArchival.module';
import { BlogService } from './blog.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      BlogPostRepository,
      BlogCommentRepository,
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
