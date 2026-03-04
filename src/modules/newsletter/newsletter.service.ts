import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { NewsletterEntity } from 'src/entities/notify/newsletter.entity';
import { EmailService } from 'src/modules/email/email.service';
import { NewsletterRepository } from 'src/repositories/newsletter.repository';
import { v4 as uuidv4 } from 'uuid';
import {
  SubscribeNewsletterDto,
  UnsubscribeNewsletterDto,
} from './dto/newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(
    private readonly newsletterRepo: NewsletterRepository,
    private readonly emailService: EmailService,
  ) {}

  async subscribe(
    dto: SubscribeNewsletterDto,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = dto;

    const existing = await this.newsletterRepo.findOne({
      where: { email, isDeleted: false },
    });

    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('Email này đã đăng ký nhận tin từ trước');
      } else {
        existing.isActive = true;
        existing.subscribedAt = new Date();
        existing.unsubscribedAt = null;
        existing.updatedAt = new Date();
        existing.updatedBy = 'system';
        await this.newsletterRepo.save(existing);
        await this.emailService.sendNewsletterWelcome(email);

        return {
          success: true,
          message: 'Kích hoạt lại đăng ký nhận tin thành công!',
        };
      }
    }

    const newsletter = new NewsletterEntity();
    newsletter.id = uuidv4();
    newsletter.email = email;
    newsletter.isActive = true;
    newsletter.subscribedAt = new Date();
    newsletter.createdAt = new Date();
    newsletter.createdBy = 'system';
    newsletter.isDeleted = false;

    await this.newsletterRepo.save(newsletter);
    await this.emailService.sendNewsletterWelcome(email);

    return {
      success: true,
      message: 'Đăng ký nhận tin thành công! Cảm ơn bạn đã quan tâm.',
    };
  }

  async unsubscribe(
    dto: UnsubscribeNewsletterDto,
  ): Promise<{ success: boolean; message: string }> {
    const { email } = dto;

    const newsletter = await this.newsletterRepo.findOne({
      where: { email, isDeleted: false, isActive: true },
    });

    if (!newsletter) {
      throw new BadRequestException('Email này chưa đăng ký nhận tin');
    }

    newsletter.isActive = false;
    newsletter.unsubscribedAt = new Date();
    newsletter.updatedAt = new Date();
    newsletter.updatedBy = 'system';

    await this.newsletterRepo.save(newsletter);

    return {
      success: true,
      message: 'Hủy đăng ký nhận tin thành công!',
    };
  }

  async getAll(): Promise<NewsletterEntity[]> {
    return await this.newsletterRepo.find({
      where: { isDeleted: false, isActive: true },
      order: { subscribedAt: 'DESC' },
    });
  }

  async getCount(): Promise<number> {
    return await this.newsletterRepo.count({
      where: { isDeleted: false, isActive: true },
    });
  }
}
