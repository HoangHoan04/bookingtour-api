import { Injectable, NotFoundException } from '@nestjs/common';
import { TourDetailRepository, TourPriceRepository } from 'src/repositories';
import { CreateTourPriceDto, UpdateTourPriceDto } from './dto';
import { TourPriceEntity } from 'src/entities';

@Injectable()
export class TourPriceService {
  constructor(
    private readonly tourPriceRepo: TourPriceRepository,
    private readonly tourDetailRepo: TourDetailRepository,
  ) {}

  async create(dto: CreateTourPriceDto): Promise<TourPriceEntity> {
    const tourDetail = await this.tourDetailRepo.findOne({
      where: { id: dto.tourDetailId },
    });

    if (!tourDetail) {
      throw new NotFoundException('Tour detail not found');
    }

    const price = this.tourPriceRepo.create({
      ...dto,
      currency: dto.currency || 'VND',
      tourDetail,
    });

    return this.tourPriceRepo.save(price);
  }
  async update(id: string, dto: UpdateTourPriceDto): Promise<TourPriceEntity> {
    const price = await this.tourPriceRepo.findOne({ where: { id } });

    if (!price) {
      throw new NotFoundException('Tour price not found');
    }

    Object.assign(price, dto);
    return this.tourPriceRepo.save(price);
  }

  async findByTourDetail(tourDetailId: string): Promise<TourPriceEntity[]> {
    return this.tourPriceRepo.find({
      where: { tourDetailId },
    });
  }
  async findOne(id: string): Promise<TourPriceEntity> {
    const price = await this.tourPriceRepo.findOne({
      where: { id },
      relations: {
        tourDetail: true,
      },
    });

    if (!price) {
      throw new NotFoundException('Tour price not found');
    }

    return price;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tourPriceRepo.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Tour price not found');
    }
  }
}
