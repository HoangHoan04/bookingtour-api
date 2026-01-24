import { Module } from '@nestjs/common';
import { NewsletterRepository } from 'src/repositories/newsletter.repository';
import { TypeOrmExModule } from 'src/typeorm';
import { EmailModule } from '../email/email.module';
import { NewsletterService } from './newsletter.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([NewsletterRepository]),
    EmailModule,
  ],
  providers: [NewsletterService],
  controllers: [],
  exports: [NewsletterService],
})
export class NewsletterModule {}
