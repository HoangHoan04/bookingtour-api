import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { BlogPostEntity, DestinationEntity } from './blogs';
import { BannerEntity } from './blogs/banner.entity';
import { NewsEntity } from './blogs/new.entity';
import { TravelHintEntity } from './blogs/travel-hint.entity';
import { ReviewEntity } from './tours';
import { CustomerEntity } from './user/customer.entity';
import { TourGuideEntity } from './user/tour_guide.entity';

@Entity('file_archive')
export class FileArchivalEntity extends BaseEntity {
  @ApiProperty({ description: 'Đường dẫn tệp' })
  @Column({ type: 'text', nullable: false, comment: 'Đường dẫn tệp' })
  fileUrl: string;

  @ApiProperty({ description: 'Tên tệp' })
  @Column({ type: 'text', nullable: false, comment: 'Tên tệp' })
  fileName: string;

  @ApiProperty({ description: 'Loại tệp' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  fileType: string;

  @ApiProperty({ description: 'Kích thước tệp (byte)' })
  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @ApiProperty({ description: 'Mô tả tệp' })
  @Column({ type: 'text', nullable: true, comment: 'Mô tả tệp' })
  description: string;

  // Avatar khách hàng
  @Column({ type: 'uuid', nullable: true })
  customerId: string;
  @ManyToOne(() => CustomerEntity, (p) => p.avatar)
  @JoinColumn({ name: 'customerId' })
  customer: Promise<CustomerEntity>;

  // Avatar hướng dẫn viên du lịch
  @Column({ type: 'uuid', nullable: true })
  tourGuideId: string;
  @ManyToOne(() => TourGuideEntity, (p) => p.avatar)
  @JoinColumn({ name: 'tourGuideId' })
  tourGuide: Promise<TourGuideEntity>;

  // Ảnh đánh giá review
  @Column({ type: 'uuid', nullable: true })
  reviewId: string;
  @ManyToOne(() => ReviewEntity, (p) => p.images)
  @JoinColumn({ name: 'reviewId' })
  review: Promise<ReviewEntity>;

  /** Id tin tức (new) */
  @Column({ type: 'varchar', nullable: true })
  newId: string;
  @ManyToOne(() => NewsEntity, (p) => p.images)
  @JoinColumn({ name: 'newId' })
  new: Promise<NewsEntity>;

  /** Id banner */
  @Column({ type: 'varchar', nullable: true })
  bannerId: string;
  @OneToOne(() => BannerEntity, (p) => p.image)
  @JoinColumn({ name: 'bannerId' })
  banner: Promise<BannerEntity>;

  /** Id blog post */
  @Column({ type: 'varchar', nullable: true })
  blogPostId: string;
  @OneToOne(() => BlogPostEntity, (p) => p.featuredImage)
  @JoinColumn({ name: 'blogPostId' })
  blogPost: Promise<BlogPostEntity>;

  /** Id travel hint */
  @Column({ type: 'varchar', nullable: true })
  travelHintId: string;
  @ManyToOne(() => TravelHintEntity, (p) => p.images)
  @JoinColumn({ name: 'travelHintId' })
  travelHint: Promise<TravelHintEntity>;

  /** Id destination */
  @Column({ type: 'varchar', nullable: true })
  destinationId: string;
  @OneToOne(() => DestinationEntity, (p) => p.image)
  @JoinColumn({ name: 'destinationId' })
  destinations: Promise<DestinationEntity>;
}
