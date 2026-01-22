import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file_archival.entity';
import { CustomerEntity } from '../user/customer.entity';
import { BlogCommentEntity } from './blog_comment.entity';

@Entity('blog_posts')
export class BlogPostEntity extends BaseEntity {
  @ApiProperty({ description: 'Tác giả bài viết' })
  @Column({ type: 'uuid', nullable: false })
  authorId: string;
  @ManyToOne(() => CustomerEntity, (customer) => customer.blogPosts)
  @JoinColumn({ name: 'authorId' })
  author: CustomerEntity;

  @ApiProperty({ description: 'Tiêu đề bài viết' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiProperty({ description: 'URL slug' })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  slug: string;

  @ApiProperty({ description: 'Tóm tắt ngắn' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  excerpt?: string;

  @ApiProperty({ description: 'Nội dung đầy đủ (HTML/Markdown)' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ description: 'Danh mục bài viết' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  category?: string;

  @ApiProperty({ description: 'Tags bài viết' })
  @Column({ type: 'json', nullable: true })
  tags?: string[];

  @ApiProperty({ description: 'Số lượt xem' })
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @ApiProperty({ description: 'Số lượt thích' })
  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @ApiProperty({ description: 'Trạng thái xuất bản' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @ApiProperty({ description: 'Tiêu đề SEO' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  seoTitle?: string;

  @ApiProperty({ description: 'Mô tả SEO' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  seoDescription?: string;

  @ApiProperty({ description: 'Thời gian xuất bản' })
  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @ApiProperty({ description: 'Comment của bài viết' })
  @OneToMany(() => BlogCommentEntity, (comment) => comment.post)
  blogComments: Promise<BlogCommentEntity[]>;

  @ApiProperty({ description: 'Ảnh đại diện bài viết' })
  @OneToOne(() => FileArchivalEntity, (file) => file.blogPost)
  featuredImage: FileArchivalEntity;
}
