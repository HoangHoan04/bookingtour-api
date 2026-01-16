import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TourItinerarieRepository,
  TourDetailRepository,
} from 'src/repositories';
import { CreateTourItinerarieDto, UpdateTourItinerarieDto } from './dto';
import { TourItinerarieEntity } from 'src/entities';

@Injectable()
export class TourItinerarieService {
  constructor(
    private readonly itinerarieRepo: TourItinerarieRepository,
    private readonly tourDetailRepo: TourDetailRepository,
  ) {}
  async create(dto: CreateTourItinerarieDto): Promise<TourItinerarieEntity> {
    const tourDetail = await this.tourDetailRepo.findOne({
      where: { id: dto.tourDetailId },
    });

    if (!tourDetail) {
      throw new NotFoundException('Tour detail not found');
    }

    const itinerary = this.itinerarieRepo.create({
      ...dto,
      tourDetail,
    });

    return this.itinerarieRepo.save(itinerary);
  }
  async update(
    id: string,
    dto: UpdateTourItinerarieDto,
  ): Promise<TourItinerarieEntity> {
    const itinerary = await this.itinerarieRepo.findOne({
      where: { id },
    });

    if (!itinerary) {
      throw new NotFoundException('Tour itinerary not found');
    }

    Object.assign(itinerary, dto);
    return this.itinerarieRepo.save(itinerary);
  }
  async findByTourDetail(
    tourDetailId: string,
  ): Promise<TourItinerarieEntity[]> {
    return this.itinerarieRepo.find({
      where: { tourDetailId },
      order: { dayNumber: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TourItinerarieEntity> {
    const itinerary = await this.itinerarieRepo.findOne({
      where: { id },
      relations: {
        tourDetail: true,
      },
    });

    if (!itinerary) {
      throw new NotFoundException('Tour itinerary not found');
    }

    return itinerary;
  }

  async remove(id: string): Promise<void> {
    const result = await this.itinerarieRepo.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Tour itinerary not found');
    }
  }
}
