import { NewsletterEntity } from 'src/entities/notify/newsletter.entity';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(NewsletterEntity)
export class NewsletterRepository extends Repository<NewsletterEntity> {}
