import { Injectable } from '@nestjs/common';
import { TourDetailRepository, TourRepository } from 'src/repositories';
import { NotFoundException } from '@nestjs/common';
import { CreateTourDetailDto } from './dto/create-tour-detail.dto';
import { UpdateTourDetailDto } from './dto/update-tour-detail.dto';
import { TourDetailEntity } from 'src/entities';
import { ActionLogCreateDto } from '../actionLog/dto';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { ActionLogService } from '../actionLog/actionLog.service';
import { FindOptionsWhere, ILike } from 'typeorm';
import { GenerateCodeHelper } from 'src/helpers/generateCodeHelper';
import { CodeType } from 'src/helpers/generateCode.config';

@Injectable()
export class TourDetailService {
  constructor(
    private readonly tourDetailRepository: TourDetailRepository,
    private readonly tourRepository: TourRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<TourDetailEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [tours, total] = await this.tourDetailRepository.findAndCount({
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

  async create(dto: CreateTourDetailDto, user: UserDto) {
    const tour = await this.tourRepository.findOne({
      where: { id: dto.tourId },
    });

    if (!tour) {
      throw new NotFoundException('Chi tiết tour không tồn tại');
    }

    const tourDetail = new TourDetailEntity();
    tourDetail.tour = tour;
    tourDetail.startDay = new Date(dto.startDay);
    tourDetail.endDay = new Date(dto.endDay);
    tourDetail.capacity = dto.capacity;

    tourDetail.code = await GenerateCodeHelper.generate(
      CodeType.TOUR_DETAIL,
      this.tourDetailRepository,
    );
    tourDetail.startLocation = dto.startLocation;
    tourDetail.remainingSeats = dto.capacity;
    tourDetail.status = dto.status ?? enumData.TOUR_DETAIL_STATUS.ACTIVE.code;
    tourDetail.createdBy = user.id ?? '5ea5a861-f590-4b89-81d1-bb42873cc56d';

    await this.tourDetailRepository.save(tourDetail);

    const actionLogDto: ActionLogCreateDto = {
      functionId: tourDetail.id,
      functionType: 'Tour Detail',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id ?? '5ea5a861-f590-4b89-81d1-bb42873cc56d',
      createdById: user.id ?? '5ea5a861-f590-4b89-81d1-bb42873cc56d',
      createdByName: user.username,
      description: `Tạo chi tiết tour: ${tourDetail.code}`,
      oldData: '{}',
      newData: JSON.stringify(dto),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo chi tiết tour thành công',
    };
  }

  async update(
    id: string,
    dto: UpdateTourDetailDto,
    user: UserDto,
  ): Promise<TourDetailEntity> {
    const detail = await this.tourDetailRepository.findOne({ where: { id } });

    if (!detail) {
      throw new NotFoundException('Chi tiết tour không tồn tại');
    }

    const updateDetail = Object.assign(detail, dto);

    const actionLogDto: ActionLogCreateDto = {
      functionId: detail.id,
      functionType: 'Tour Detail',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật chi tiết tour: ${detail.code}`,
      oldData: JSON.stringify(detail),
      newData: JSON.stringify(updateDetail),
    };
    await this.actionLogService.create(actionLogDto);

    return this.tourDetailRepository.save(detail);
  }

  async findByTour(tourId: string): Promise<TourDetailEntity[]> {
    return this.tourDetailRepository.find({
      where: { tourId },
      relations: {
        tour: true,
        tourPrice: true,
        tourItinerarie: true,
      },
    });
  }

  async findById(id: string): Promise<TourDetailEntity> {
    const detail = await this.tourDetailRepository.findOne({
      where: { id },
      relations: {
        tour: true,
        tourPrice: true,
        tourItinerarie: true,
      },
    });

    if (!detail) {
      throw new NotFoundException('Tour detail không tồn tại');
    }

    return detail;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tourDetailRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Tour detail not found');
    }
  }

  async activateTourDetail(user: UserDto, id: string) {
    const tourDetail = await this.tourDetailRepository.findOne({
      where: { id, isDeleted: true },
    });

    if (!tourDetail) {
      throw new NotFoundException('Không tìm thấy chi tiết tour');
    }

    await this.tourDetailRepository.update(id, {
      isDeleted: false,
      status: enumData.TOUR_DETAIL_STATUS.ACTIVE.code,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: tourDetail.id,
      functionType: 'Tour Detail',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt chi tiết tour với id: ${tourDetail.code}`,
      oldData: JSON.stringify(tourDetail),
      newData: JSON.stringify({
        ...tourDetail,
        isDeleted: false,
        status: enumData.TOUR_DETAIL_STATUS.ACTIVE.code,
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt chi tiết tour thành công',
    };
  }

  async deactivateTourDetail(user: UserDto, id: string) {
    const tourDetail = await this.tourDetailRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!tourDetail) {
      throw new NotFoundException('Không tìm thấy chi tiết tour');
    }

    await this.tourDetailRepository.update(id, {
      isDeleted: true,
      status: enumData.TOUR_DETAIL_STATUS.INACTIVE.code,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: tourDetail.id,
      functionType: 'Tour Detail',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động chi tiết tour với id: ${tourDetail.code}`,
      oldData: JSON.stringify(tourDetail),
      newData: JSON.stringify({
        ...tourDetail,
        isDeleted: true,
        status: enumData.TOUR_DETAIL_STATUS.INACTIVE.code,
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động chi tiết tour thành công',
    };
  }

  async changeStatus(id: string, status: string, user: UserDto) {
    const tourDetail = await this.tourDetailRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!tourDetail) {
      throw new NotFoundException('Không tìm thấy chi tiết tour');
    }

    const oldStatus = tourDetail.status;
    tourDetail.status = status;
    tourDetail.updatedBy = user.id;
    tourDetail.updatedAt = new Date();

    await this.tourDetailRepository.save(tourDetail);

    const actionLogDto: ActionLogCreateDto = {
      functionId: tourDetail.id,
      functionType: 'Tour Detail  ',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Thay đổi trạng thái chi tiết tour "${tourDetail.code}" từ ${oldStatus} sang ${status}`,
      oldData: JSON.stringify({ status: oldStatus }),
      newData: JSON.stringify({ status }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Thay đổi trạng thái chi tiết tour thành công',
    };
  }

  async selectBoxTourDetail() {
    const tourDetails = await this.tourDetailRepository.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
        startDay: true,
      },
    });
    return tourDetails;
  }
}
