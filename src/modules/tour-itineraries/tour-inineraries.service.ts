import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TourItinerarieRepository,
  TourDetailRepository,
} from 'src/repositories';
import { CreateTourItinerarieDto, UpdateTourItinerarieDto } from './dto';
import { TourItinerarieEntity } from 'src/entities';
import { ActionLogService } from '../actionLog/actionLog.service';
import { UserDto } from 'src/dto';
import { ActionLogCreateDto } from '../actionLog/dto';
import { enumData } from 'src/common/constants';

@Injectable()
export class TourItinerarieService {
  constructor(
    private readonly itinerarieRepo: TourItinerarieRepository,
    private readonly tourDetailRepo: TourDetailRepository,
    private readonly actionLogService: ActionLogService,
  ) {}
  async create(dto: CreateTourItinerarieDto, user: UserDto) {
    const tourDetail = await this.tourDetailRepo.findOne({
      where: { id: dto.tourDetailId },
    });

    if (!tourDetail) {
      throw new NotFoundException('Tour detail not found');
    }

    const existIninerary = await this.itinerarieRepo.findOne({
      where: {
        tourDetail: { id: dto.tourDetailId },
        dayNumber: dto.dayNumber,
      },
    });

    const itinerary = new TourItinerarieEntity();
    itinerary.tourDetail = tourDetail;
    itinerary.code = dto.code || '';
    itinerary.title = dto.title;
    itinerary.dayNumber = dto.dayNumber;
    itinerary.content = dto.content;
    itinerary.activities = dto.activities;
    itinerary.meals = dto.meals;
    itinerary.accommodation = dto.accommodation;
    itinerary.createdBy = user.id;

    const actionLog: ActionLogCreateDto = {
      functionId: itinerary.id,
      functionType: 'Tour Itinerary',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo lịch trình tour: ${itinerary.title}`,
      oldData: '{}',
      newData: JSON.stringify(dto),
    };

    await this.itinerarieRepo.save(itinerary);
    await this.actionLogService.create(actionLog);

    return {
      message: 'Tạo lịch trình tour thành công',
    };
  }

  async update(id: string, dto: UpdateTourItinerarieDto, user: UserDto) {
    const itinerary = await this.itinerarieRepo.findOne({
      where: { id },
    });

    if (!itinerary) {
      throw new NotFoundException('Tour itinerary not found');
    }

    Object.assign(itinerary, dto);
    await this.itinerarieRepo.save(itinerary);

    const actionLog: ActionLogCreateDto = {
      functionId: itinerary.id,
      functionType: 'Tour Itinerary',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật lịch trình tour: ${itinerary.title}`,
      oldData: JSON.stringify(itinerary),
      newData: JSON.stringify(dto),
    };
    await this.actionLogService.create(actionLog);

    return {
      message: 'Cập nhật lịch trình tour thành công',
    };
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
