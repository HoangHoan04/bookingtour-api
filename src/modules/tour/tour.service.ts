import { TourRepository } from 'src/repositories';
import { CreateTourDto } from './dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourEntity } from 'src/entities';
import slugify from 'slugify';

@Injectable()
export class TourService {
  constructor(private readonly tourRepo: TourRepository) {}

  async findOne(id: string): Promise<TourEntity> {
    const tour = await this.tourRepo.findOne({
      where: { id },
      relations: {
        tourDetails: true,
        reviews: true,
      },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    return tour;
  }

  async findAll(): Promise<TourEntity[]> {
    return this.tourRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async createTour(dto: CreateTourDto) {
    const tour = this.tourRepo.create({
      ...dto,
      slug: slugify(dto.title, { lower: true, strict: true }),
      rating: 0,
      reviewCount: 0,
      viewCount: 0,
      bookingCount: 0,
    });
    return this.tourRepo.save(tour);
  }

  async update(id: string, dto: UpdateTourDto): Promise<TourEntity> {
    const tour = await this.tourRepo.findOne({ where: { id } });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    Object.assign(tour, dto);
    return this.tourRepo.save(tour);
  }
}
