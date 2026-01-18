import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { CustomerEntity } from '../user/customer.entity';
import { BlogPostEntity } from './blog_post.entity';

@Entity('blog_comments')
export class BlogCommentEntity extends BaseEntity {
  @ApiProperty({ description: 'ID bài viết' })
  @Column({ type: 'uuid', nullable: false })
  postId: string;
  @ManyToOne(() => BlogPostEntity, (post) => post.blogComments)
  @JoinColumn({ name: 'postId' })
  post: BlogPostEntity;

  @ApiProperty({ description: 'ID người bình luận' })
  @Column({ type: 'uuid', nullable: false })
  customerId: string;
  @ManyToOne(() => CustomerEntity, (customer) => customer.blogComments)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ApiProperty({ description: 'ID bình luận cha (nếu có)' })
  @Column({ type: 'uuid', nullable: true })
  parentId?: string;
  @ManyToOne(() => BlogCommentEntity, (comment) => comment.replies)
  @JoinColumn({ name: 'parentId' })
  parent?: BlogCommentEntity;

  @ApiProperty({ description: 'Bình luận trả lời' })
  @OneToMany(() => BlogCommentEntity, (comment) => comment.parent)
  replies: Promise<BlogCommentEntity[]>;

  @ApiProperty({ description: 'Nội dung bình luận' })
  @Column({ type: 'varchar', length: 500, nullable: false })
  content: string;

  @ApiProperty({ description: 'Trạng thái bình luận' })
  @Column({ type: 'varchar', length: 50 })
  status: string;
}
