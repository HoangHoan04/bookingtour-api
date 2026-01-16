import { Injectable } from '@nestjs/common';
import { TourDetailRepository, TourRepository } from 'src/repositories';
import { NotFoundException } from '@nestjs/common';
import { CreateTourDetailDto } from './dto/create-tour-detail.dto';
import { UpdateTourDetailDto } from './dto/update-tour-detail.dto';
import { TourDetailEntity } from 'src/entities';

@Injectable()
export class TourDetailService {
  constructor(
    private readonly tourDetailRepository: TourDetailRepository,
    private readonly tourRepository: TourRepository,
  ) {}

  async create(dto: CreateTourDetailDto): Promise<TourDetailEntity> {
    const tour = await this.tourRepository.findOne({
      where: { id: dto.tourId },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    const detail = this.tourDetailRepository.create({
      ...dto,
      tour,
    });

    return this.tourDetailRepository.save(detail);
  }

  async update(
    id: string,
    dto: UpdateTourDetailDto,
  ): Promise<TourDetailEntity> {
    const detail = await this.tourDetailRepository.findOne({ where: { id } });

    if (!detail) {
      throw new NotFoundException('Tour detail not found');
    }

    Object.assign(detail, dto);
    return this.tourDetailRepository.save(detail);
  }

  async findByTour(tourId: string): Promise<TourDetailEntity[]> {
    return this.tourDetailRepository.find({
      where: { tourId },
      relations: {
        tourPrice: true,
        tourItinerarie: true,
      },
    });
  }

  async findOne(id: string): Promise<TourDetailEntity> {
    const detail = await this.tourDetailRepository.findOne({
      where: { id },
      relations: {
        tour: true,
        tourPrice: true,
        tourItinerarie: true,
      },
    });

    if (!detail) {
      throw new NotFoundException('Tour detail not found');
    }

    return detail;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tourDetailRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Tour detail not found');
    }
  }
}
