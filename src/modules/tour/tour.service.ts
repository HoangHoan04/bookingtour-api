import { Injectable, NotFoundException } from '@nestjs/common';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { TourEntity } from 'src/entities';
import { TourRepository } from 'src/repositories';
import { FindOptionsWhere, ILike } from 'typeorm';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreateTourDto } from './dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Injectable()
export class TourService {
  constructor(
    private readonly repo: TourRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async findOne(id: string) {
    const tour = await this.repo.findOne({
      where: { id },
      relations: {
        tourDetails: true,
        reviews: true,
      },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour');
    }

    return tour;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<TourEntity> = {};

    if (data.where.title) whereCon.title = ILike(`%${data.where.title}%`);
    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [tours, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: tours,
      total,
    };
  }

  async createTour(dto: CreateTourDto, user: UserDto) {
    const existingTour = await this.repo.findOne({
      where: {
        code: dto.code,
      },
    });
    if (existingTour) {
      throw new NotFoundException('Mã tour đã tồn tại');
    }

    const tour = new TourEntity();
    tour.code = dto.code;
    tour.title = dto.title;
    tour.slug = dto.slug;
    tour.location = dto.location;
    tour.durations = dto.durations;
    tour.shortDescription = dto.shortDescription;
    tour.longDescription = dto.longDescription;
    tour.highlights = dto.highlights;
    tour.included = dto.included;
    tour.excluded = dto.excluded;
    tour.category = dto.category;
    tour.status = dto.status;
    tour.tags = dto.tags;
    tour.createdBy = user.id;
    tour.createdAt = new Date();

    await this.repo.insert(tour);

    const actionLogDto: ActionLogCreateDto = {
      functionId: tour.id,
      functionType: 'Tour',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới tour: ${tour.title}`,
      oldData: '{}',
      newData: JSON.stringify(tour),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới tour thành công',
    };
  }

  async update(dto: UpdateTourDto, user: UserDto) {
    const tour = await this.repo.findOne({ where: { id: dto.id } });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    Object.assign(tour, dto);
    return this.repo.save(tour);
  }
}
