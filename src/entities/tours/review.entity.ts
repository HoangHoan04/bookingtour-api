import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { FileArchivalEntity } from '../file_archival.entity';
import { CustomerEntity } from '../user/customer.entity';
import { BookingEntity } from './booking.entity';
import { ReviewResponseEntity } from './review_response.entity';
import { TourEntity } from './tour.entity';

@Entity('reviews')
export class ReviewEntity extends BaseEntity {
  @ApiProperty({ description: 'ID của tour được đánh giá' })
  @Column({ type: 'uuid' })
  tourId: string;
  @ManyToOne(() => TourEntity, (tour) => tour.reviews)
  @JoinColumn({ name: 'tourId' })
  tour: TourEntity;

  @ApiProperty({ description: 'ID của người đánh giá' })
  @Column({ type: 'uuid' })
  customerId: string;
  @ManyToOne(() => CustomerEntity, (customer) => customer.reviews)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @ApiProperty({ description: 'ID của đơn đặt tour (để verify)' })
  @Column({ type: 'uuid' })
  bookingId: string;
  @ManyToOne(() => BookingEntity, (booking) => booking.reviews)
  @JoinColumn({ name: 'bookingId' })
  booking: BookingEntity;

  @ApiProperty({ description: 'Tên người đánh giá' })
  @Column({ type: 'varchar', length: 100 })
  reviewerName: string;

  @ApiProperty({ description: 'Nội dung đánh giá' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Số sao (1-5)' })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty({
    description: 'Đã xác thực đặt tour',
    type: 'boolean',
    default: false,
  })
  @Column({ type: 'boolean', default: 0 })
  isVerified: boolean;

  @ApiProperty({
    description: 'Số người thích đánh giá này',
    type: 'number',
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  likes: number;

  @ApiProperty({ description: 'Trạng thái kiểm duyệt' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  status: string;

  @ApiProperty({ description: 'Lý do từ chối', type: 'string', nullable: true })
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @ApiProperty({ description: 'Ảnh review' })
  @OneToMany(() => FileArchivalEntity, (p) => p.review)
  images: Promise<FileArchivalEntity[]>;

  @ApiProperty({ description: 'Phản hồi review' })
  @OneToMany(() => ReviewResponseEntity, (response) => response.review)
  responses: Promise<ReviewResponseEntity[]>;
}
