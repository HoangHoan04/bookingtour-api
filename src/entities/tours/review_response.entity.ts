import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TourGuideEntity } from '../user';
import { ReviewEntity } from './review.entity';

@Entity('review_responses')
export class ReviewResponseEntity extends BaseEntity {
  @ApiProperty({ description: 'ID bài đánh giá' })
  @Column({ type: 'uuid', nullable: false })
  reviewId: string;

  @ManyToOne(() => ReviewEntity, (review) => review.responses)
  @JoinColumn({ name: 'reviewId' })
  review: ReviewEntity;

  @ApiProperty({ description: 'Người phản hồi đánh giá' })
  @Column({ type: 'uuid' })
  responderId: string;

  @ApiProperty({ description: 'Nội dung phản hồi' })
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({ description: 'Hướng dẫn viên phản hồi' })
  @ManyToOne(() => TourGuideEntity, (guide) => guide.reviewResponses)
  @JoinColumn({ name: 'responderId' })
  responder: TourGuideEntity;
}
