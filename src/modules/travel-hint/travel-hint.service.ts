import { Injectable, NotFoundException } from '@nestjs/common';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { TravelHintEntity } from 'src/entities/blogs/travel-hint.entity';
import { transformKeys } from 'src/helpers';
import { FileArchivalRepository } from 'src/repositories';
import { TravelHintRepository } from 'src/repositories/blog.repository';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { FileArchivalCreateDto } from '../file-archival/dto';
import { FileArchivalService } from '../file-archival/file-archival.service';
import { CreateTravelHintDto, UpdateTravelHintDto } from './dto';

@Injectable()
export class TravelHintService {
  constructor(
    private readonly repo: TravelHintRepository,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalService: FileArchivalService,
    private readonly fileArchivalRepo: FileArchivalRepository,
  ) {}

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
      relations: {
        images: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy địa điểm gợi ý');
    }

    const data = transformKeys(result);

    return {
      message: 'Tìm kiếm địa điểm gợi ý thành công',
      data,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<TravelHintEntity> = {};

    if (data.where.locationName)
      whereCon.locationName = ILike(`%${data.where.locationName}%`);
    if (data.where.type) whereCon.type = ILike(`%${data.where.type}%`);
    if (data.where.tags) whereCon.tags = ILike(`%${data.where.tags}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [travelHints, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: travelHints,
      total,
    };
  }

  async create(user: UserDto, createDto: CreateTravelHintDto) {
    const travelHint = new TravelHintEntity();
    travelHint.id = uuidv4();
    travelHint.month = createDto.month;
    travelHint.locationName = createDto.locationName;
    travelHint.description = createDto.description;
    travelHint.reason = createDto.reason;
    travelHint.type = createDto.type;
    travelHint.tags = createDto.tags;
    travelHint.country = createDto.country;
    travelHint.city = createDto.city;
    travelHint.latitude = createDto.latitude;
    travelHint.longitude = createDto.longitude;
    travelHint.createdBy = user.id;
    travelHint.createdAt = new Date();
    await this.repo.insert(travelHint);

    if (
      createDto.images &&
      Array.isArray(createDto.images) &&
      createDto.images.length > 0
    ) {
      const fileArchivalDtos: FileArchivalCreateDto[] = createDto.images
        .filter((image) => image?.fileUrl && image?.fileName)
        .map((image) => ({
          fileUrl: image.fileUrl,
          fileName: image.fileName,
          fileType: 'TRAVEL_HINT_IMAGE',
          createdBy: user.id,
          createdAt: new Date().toISOString(),
          fileRelationName: 'travelHintId',
          fileRelationId: travelHint.id,
        }));

      if (fileArchivalDtos.length > 0) {
        await this.fileArchivalService.createMany(fileArchivalDtos);
      }
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: travelHint.id,
      functionType: 'TravelHint',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới gợi ý du lịch: ${travelHint.locationName}`,
      oldData: '{}',
      newData: JSON.stringify(travelHint),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới gợi ý du lịch thành công',
    };
  }

  async update(updateDto: UpdateTravelHintDto, user: UserDto) {
    const travelHint = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!travelHint) {
      throw new NotFoundException('Không tìm thấy gợi ý du lịch');
    }

    const oldTravelHintData = JSON.stringify(travelHint);

    const travelHintUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.month !== undefined)
      travelHintUpdateData.month = updateDto.month;
    if (updateDto.locationName !== undefined)
      travelHintUpdateData.locationName = updateDto.locationName;
    if (updateDto.description !== undefined)
      travelHintUpdateData.description = updateDto.description;
    if (updateDto.reason !== undefined)
      travelHintUpdateData.reason = updateDto.reason;
    if (updateDto.type !== undefined)
      travelHintUpdateData.type = updateDto.type;
    if (updateDto.tags !== undefined)
      travelHintUpdateData.tags = updateDto.tags;
    if (updateDto.country !== undefined)
      travelHintUpdateData.country = updateDto.country;
    if (updateDto.city !== undefined)
      travelHintUpdateData.city = updateDto.city;
    if (updateDto.latitude !== undefined)
      travelHintUpdateData.latitude = updateDto.latitude;
    if (updateDto.longitude !== undefined)
      travelHintUpdateData.longitude = updateDto.longitude;

    if (Object.prototype.hasOwnProperty.call(updateDto, 'images')) {
      await this.fileArchivalRepo.delete({ travelHintId: updateDto.id });

      if (
        updateDto.images &&
        Array.isArray(updateDto.images) &&
        updateDto.images.length > 0
      ) {
        const fileArchivalDtos: FileArchivalCreateDto[] = updateDto.images
          .filter((image) => image?.fileUrl && image?.fileName)
          .map((image) => ({
            fileUrl: image.fileUrl,
            fileName: image.fileName,
            fileType: 'TRAVEL_HINT_IMAGE',
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            fileRelationName: 'travelHintId',
            fileRelationId: travelHint.id,
          }));

        if (fileArchivalDtos.length > 0) {
          await this.fileArchivalService.createMany(fileArchivalDtos);
        }
      }
    }

    await this.repo.update(travelHint.id, travelHintUpdateData);

    const updatedTravelHint = await this.repo.findOne({
      where: { id: travelHint.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: travelHint.id,
      functionType: 'TravelHint',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật gợi ý du lịch: ${travelHint.locationName}`,
      oldData: oldTravelHintData,
      newData: JSON.stringify(updatedTravelHint),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật gợi ý du lịch thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const travelHint = await this.repo.findOne({ where: { id } });
    if (!travelHint) {
      throw new NotFoundException('Không tìm thấy gợi ý du lịch');
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: travelHint.id,
      functionType: 'TravelHint',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động gợi ý du lịch với tiêu đề: ${travelHint.locationName}`,
      oldData: JSON.stringify(travelHint),
      newData: JSON.stringify({
        ...travelHint,
        isDeleted: true,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Ngừng hoạt động gợi ý du lịch thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const travelHint = await this.repo.findOne({ where: { id } });
    if (!travelHint) {
      throw new NotFoundException('Không tìm thấy gợi ý du lịch');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: travelHint.id,
      functionType: 'TravelHint',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt gợi ý du lịch với tiêu đề: ${travelHint.locationName}`,
      oldData: JSON.stringify(travelHint),
      newData: JSON.stringify({
        ...travelHint,
        isDeleted: false,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt gợi ý du lịch thành công',
    };
  }

  async findByIds(ids: string[]): Promise<TravelHintEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }

  async findByType(type?: string) {
    const whereConditions: any = {
      isDeleted: false,
    };

    if (type) {
      whereConditions.type = type;
    }

    const travelHints = await this.repo.find({
      where: whereConditions,
      relations: {
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const data = travelHints.map((travelHint) => {
      const transformed = transformKeys(travelHint);
      if (transformed.images && !Array.isArray(transformed.images)) {
        transformed.images = [transformed.images];
      } else if (!transformed.images) {
        transformed.images = [];
      }
      return transformed;
    });

    return {
      message: 'Lấy danh sách gợi ý du lịch thành công',
      data,
    };
  }

  async findAll() {
    const whereConditions: any = {
      isDeleted: false,
    };

    const travelHints = await this.repo.find({
      where: whereConditions,
      relations: {
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const data = travelHints.map((travelHint) => {
      const transformed = transformKeys(travelHint);
      if (transformed.images && !Array.isArray(transformed.images)) {
        transformed.images = [transformed.images];
      } else if (!transformed.images) {
        transformed.images = [];
      }
      return transformed;
    });

    return {
      message: 'Lấy danh sách gợi ý du lịch thành công',
      data,
    };
  }
}
