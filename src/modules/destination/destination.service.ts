import { Injectable, NotFoundException } from '@nestjs/common';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { DestinationEntity } from 'src/entities';
import { transformKeys } from 'src/helpers';
import { DestinationRepository } from 'src/repositories/blog.repository';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreateDestinationDto, UpdateDestinationDto } from './dto';

@Injectable()
export class DestinationService {
  constructor(
    private readonly repo: DestinationRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy điểm đến');
    }

    const data = transformKeys(result);

    return {
      message: 'Tìm kiếm điểm đến thành công',
      data,
    };
  }

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });
    return res;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<DestinationEntity> = {};

    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if (data.where.country) whereCon.country = ILike(`%${data.where.country}%`);
    if (data.where.region) whereCon.region = ILike(`%${data.where.region}%`);
    if (data.where.status) whereCon.status = ILike(`%${data.where.status}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [destinations, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: destinations,
      total,
    };
  }

  async create(createDto: CreateDestinationDto, user: UserDto) {
    const destination = new DestinationEntity();
    destination.id = uuidv4();
    destination.code = createDto.code;
    destination.name = createDto.name;
    destination.slug = createDto.slug;
    destination.country = createDto.country;
    destination.region = createDto.region;
    destination.description = createDto.description;
    destination.imageUrl = createDto.imageUrl;
    destination.latitude = createDto.latitude;
    destination.longitude = createDto.longitude;
    destination.bestTimeToVisit = createDto.bestTimeToVisit;
    destination.averageTemperature = createDto.averageTemperature;
    destination.popularActivities = createDto.popularActivities;
    destination.status = createDto.status;
    destination.touringCount = 0;
    destination.viewCount = 0;
    destination.rating = 0;
    destination.createdBy = user.id;
    destination.createdAt = new Date();

    await this.repo.insert(destination);

    const actionLogDto: ActionLogCreateDto = {
      functionId: destination.id,
      functionType: 'Destination',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới điểm đến: ${destination.name}`,
      oldData: '{}',
      newData: JSON.stringify(destination),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới điểm đến thành công',
    };
  }

  async update(data: UpdateDestinationDto, user: UserDto) {
    const destination = await this.repo.findOne({ where: { id: data.id } });
    if (!destination) {
      throw new NotFoundException('Không tìm thấy điểm đến');
    }

    const oldDestinationData = JSON.stringify(destination);

    const destinationUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (data.code) destinationUpdateData.code = data.code;
    if (data.name) destinationUpdateData.name = data.name;
    if (data.slug) destinationUpdateData.slug = data.slug;
    if (data.country) destinationUpdateData.country = data.country;
    if (data.region) destinationUpdateData.region = data.region;
    if (data.description !== undefined)
      destinationUpdateData.description = data.description;
    if (data.imageUrl !== undefined)
      destinationUpdateData.imageUrl = data.imageUrl;
    if (data.latitude !== undefined)
      destinationUpdateData.latitude = data.latitude;
    if (data.longitude !== undefined)
      destinationUpdateData.longitude = data.longitude;
    if (data.bestTimeToVisit)
      destinationUpdateData.bestTimeToVisit = data.bestTimeToVisit;
    if (data.averageTemperature)
      destinationUpdateData.averageTemperature = data.averageTemperature;
    if (data.popularActivities !== undefined)
      destinationUpdateData.popularActivities = data.popularActivities;
    if (data.status) destinationUpdateData.status = data.status;

    await this.repo.update(destination.id, destinationUpdateData);

    const updatedDestination = await this.repo.findOne({
      where: { id: destination.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: destination.id,
      functionType: 'Destination',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật điểm đến: ${destination.name}`,
      oldData: oldDestinationData,
      newData: JSON.stringify(updatedDestination),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật điểm đến thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const destination = await this.repo.findOne({ where: { id } });
    if (!destination) {
      throw new NotFoundException('Không tìm thấy điểm đến');
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: destination.id,
      functionType: 'Destination',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động điểm đến: ${destination.name}`,
      oldData: JSON.stringify(destination),
      newData: JSON.stringify({
        ...destination,
        isDeleted: true,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Ngừng hoạt động điểm đến thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const destination = await this.repo.findOne({ where: { id } });
    if (!destination) {
      throw new NotFoundException('Không tìm thấy điểm đến');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: destination.id,
      functionType: 'Destination',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt điểm đến: ${destination.name}`,
      oldData: JSON.stringify(destination),
      newData: JSON.stringify({
        ...destination,
        isDeleted: false,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt điểm đến thành công',
    };
  }

  async findByIds(ids: string[]): Promise<DestinationEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }
}
