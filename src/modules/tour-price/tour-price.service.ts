import { Injectable, NotFoundException } from '@nestjs/common';
import { TourDetailRepository, TourPriceRepository } from 'src/repositories';
import { CreateTourPriceDto, UpdateTourPriceDto } from './dto';
import { TourPriceEntity } from 'src/entities';
import { UserDto } from 'src/dto';
import { ActionLogCreateDto } from '../actionLog/dto';
import { enumData } from 'src/common/constants/enumData';
import { ActionLogService } from '../actionLog/actionLog.service';
import { GenerateCodeHelper } from 'src/helpers/generateCodeHelper';
import { CodeType } from 'src/helpers/generateCode.config';

@Injectable()
export class TourPriceService {
  constructor(
    private readonly tourPriceRepo: TourPriceRepository,
    private readonly tourDetailRepo: TourDetailRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async create(dto: CreateTourPriceDto, user: UserDto) {
    const tourDetail = await this.tourDetailRepo.findOne({
      where: { id: dto.tourDetailId },
    });

    if (!tourDetail) {
      throw new NotFoundException('Chi tiết tour không tồn tại');
    }

    const price = new TourPriceEntity();
    price.code = await GenerateCodeHelper.generate(
      CodeType.PRICE,
      this.tourPriceRepo,
    );
    price.priceType = dto.priceType ?? enumData.Tour_Price_Type.ADULT.code;

    price.price = dto.price;
    price.currency = dto.currency || 'VND';
    price.tourDetail = tourDetail;
    price.createdBy = user.id;

    await this.tourPriceRepo.save(price);
    const actionLog: ActionLogCreateDto = {
      functionId: price.id,
      functionType: 'Tour Price',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật chi tiết tour: ${price.code}`,
      oldData: '{}',
      newData: JSON.stringify(dto),
    };

    await this.actionLogService.create(actionLog);
    return {
      message: 'Tạo giá tour thành công',
    };
  }

  async update(id: string, dto: UpdateTourPriceDto, user: UserDto) {
    const price = await this.tourPriceRepo.findOne({ where: { id } });

    if (!price) {
      throw new NotFoundException('Tour price không tồn tại');
    }
    const updatedPrice = Object.assign(price, dto);

    const actionLog: ActionLogCreateDto = {
      functionId: price.id,
      functionType: 'Tour Price',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật giá tour: ${price.code}`,
      oldData: JSON.stringify(price),
      newData: JSON.stringify(updatedPrice),
    };

    await this.tourPriceRepo.save(price);
    await this.actionLogService.create(actionLog);
    return {
      message: 'Cập nhật giá tour thành công',
    };
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
