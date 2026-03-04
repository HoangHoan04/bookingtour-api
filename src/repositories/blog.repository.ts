import {
  BlogCommentEntity,
  BlogPostEntity,
  DestinationEntity,
  TourDestinationEntity,
} from 'src/entities';
import { BannerEntity } from 'src/entities/blogs/banner.entity';
import { NewsEntity } from 'src/entities/blogs/new.entity';
import { TravelHintEntity } from 'src/entities/blogs/travel-hint.entity';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(BlogPostEntity)
export class BlogPostRepository extends Repository<BlogPostEntity> {}

@CustomRepository(BlogCommentEntity)
export class BlogCommentRepository extends Repository<BlogCommentEntity> {}

@CustomRepository(DestinationEntity)
export class DestinationRepository extends Repository<DestinationEntity> {}

@CustomRepository(BannerEntity)
export class BannerRepository extends Repository<BannerEntity> {}

@CustomRepository(NewsEntity)
export class NewsRepository extends Repository<NewsEntity> {}

@CustomRepository(TravelHintEntity)
export class TravelHintRepository extends Repository<TravelHintEntity> {}

@CustomRepository(TourDestinationEntity)
export class TourDestinationRepository extends Repository<TourDestinationEntity> {}
