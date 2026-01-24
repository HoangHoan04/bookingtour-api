import { Injectable, NotFoundException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { DestinationEntity } from 'src/entities';
import { coreHelper, transformKeys } from 'src/helpers';
import { FileArchivalRepository, TourRepository } from 'src/repositories';
import { DestinationRepository } from 'src/repositories/blog.repository';
import { FindOptionsWhere, ILike, In, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { FileArchivalCreateDto } from '../file-archival/dto';
import { FileArchivalService } from '../file-archival/file-archival.service';
import { CreateDestinationDto, UpdateDestinationDto } from './dto';

@Injectable()
export class DestinationService {
  constructor(
    private readonly repo: DestinationRepository,
    private readonly tourRepo: TourRepository,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalService: FileArchivalService,
    private readonly fileArchivalRepo: FileArchivalRepository,
  ) {}

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
      relations: {
        tourDestinations: {
          tour: true,
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy điểm đến');
    }

    const tourDestinations = await result.tourDestinations;
    const touringCount = tourDestinations ? tourDestinations.length : 0;

    const data = transformKeys({ ...result, touringCount });

    return {
      message: 'Tìm kiếm điểm đến thành công',
      data,
    };
  }

  async findBySlug(slug: string) {
    const result = await this.repo.findOne({
      where: { slug, isDeleted: false },
      relations: {
        image: true,
        tourDestinations: {
          tour: true,
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy điểm đến');
    }

    const tourDestinations = await result.tourDestinations;
    const touringCount = tourDestinations ? tourDestinations.length : 0;

    const data = transformKeys({ ...result, touringCount });

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
      relations: {
        image: true,
      },
    });

    return {
      data: destinations,
      total,
    };
  }

  private genCodeDestination() {
    const generate = customAlphabet('0123456789', 3);
    return `DES${generate()}`;
  }

  async create(createDto: CreateDestinationDto, user: UserDto) {
    const destination = new DestinationEntity();
    destination.id = uuidv4();
    destination.code = this.genCodeDestination();
    destination.name = createDto.name;
    destination.slug = coreHelper.generateSlug(destination.name);
    let isUnique = false;
    let attempt = 0;
    const maxAttempts = 5;
    while (!isUnique && attempt < maxAttempts) {
      const existing = await this.repo.findOne({
        where: { slug: destination.slug },
      });
      if (!existing) {
        isUnique = true;
      } else {
        destination.slug = `${coreHelper.generateSlug(destination.name)}-${customAlphabet('0123456789', 3)()}`;
        attempt++;
      }
    }

    if (!isUnique) {
      destination.slug = `des-${destination.code.toLowerCase()}`;
    }
    destination.country = createDto.country;
    destination.region = createDto.region;
    destination.description = createDto.description;
    destination.latitude = createDto.latitude;
    destination.longitude = createDto.longitude;
    destination.bestTimeToVisit = createDto.bestTimeToVisit;
    destination.averageTemperature = createDto.averageTemperature;
    destination.popularActivities = createDto.popularActivities;
    destination.status = createDto.status;
    destination.viewCount = 0;
    destination.rating = 0;
    destination.status = 'NEW';
    destination.createdBy = user.id;
    destination.createdAt = new Date();

    await this.repo.insert(destination);

    const image = Array.isArray(createDto.image)
      ? createDto.image[0]
      : createDto.image;
    if (image?.fileUrl && image?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: image.fileUrl,
        fileName: image.fileName,
        fileType: 'DESTINATION_IMAGE',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'destinationId',
        fileRelationId: destination.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

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

    if (data.name) destinationUpdateData.name = data.name;
    let slugChanged = false;
    if (data.name !== undefined && data.name.trim() !== destination.name) {
      data.name = data.name.trim();
      const newSlug = coreHelper.generateSlug(data.name);
      const existing = await this.repo.findOne({
        where: { slug: newSlug, id: Not(data.id) },
      });

      data.slug = existing
        ? `${newSlug}-${customAlphabet('0123456789', 3)()}`
        : newSlug;

      slugChanged = true;
    }
    if (data.country) destinationUpdateData.country = data.country;
    if (data.region) destinationUpdateData.region = data.region;
    if (data.description !== undefined)
      destinationUpdateData.description = data.description;
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

    if (Object.prototype.hasOwnProperty.call(data, 'image')) {
      await this.fileArchivalRepo.delete({ destinationId: data.id });

      const imageData = Array.isArray(data.image) ? data.image[0] : data.image;
      if (imageData?.fileUrl && imageData?.fileName) {
        const fileArchival = new FileArchivalCreateDto();
        fileArchival.createdBy = user.id;
        fileArchival.fileUrl = imageData.fileUrl;
        fileArchival.fileName = imageData.fileName;
        fileArchival.fileRelationName = 'destinationId';
        fileArchival.fileRelationId = data.id;
        await this.fileArchivalService.create(fileArchival);
      }
    }

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

  async getToursByDestination(destinationId: string) {
    const destination = await this.repo.findOne({
      where: { id: destinationId, isDeleted: false },
      relations: {
        tourDestinations: {
          tour: true,
        },
      },
    });

    if (!destination) {
      throw new NotFoundException('Không tìm thấy điểm đến');
    }

    const tourDestinations = await destination.tourDestinations;
    const tours = tourDestinations?.map((td) => td.tour).filter(Boolean) || [];

    return {
      message: 'Lấy danh sách tour thành công',
      data: tours,
      total: tours.length,
    };
  }

  async incrementViewCount(id: string) {
    const destination = await this.repo.findOne({ where: { id } });
    if (!destination) {
      throw new NotFoundException('Không tìm thấy điểm đến');
    }

    await this.repo.update(id, {
      viewCount: destination.viewCount + 1,
    });

    return {
      message: 'Cập nhật lượt xem thành công',
    };
  }

  async getPopularDestinations(limit: number = 10) {
    const destinations = await this.repo.find({
      where: { isDeleted: false },
      order: { viewCount: 'DESC' },
      take: limit,
      relations: {
        tourDestinations: {
          tour: true,
        },
        image: true,
      },
    });

    const destinationsWithCount = await Promise.all(
      destinations.map(async (dest) => {
        const tourDestinations = await dest.tourDestinations;
        const touringCount = tourDestinations ? tourDestinations.length : 0;
        return { ...dest, touringCount };
      }),
    );

    const data = transformKeys(destinationsWithCount);

    return {
      message: 'Lấy danh sách điểm đến phổ biến thành công',
      data: data,
    };
  }

  async searchDestinations(keyword: string) {
    const destinations = await this.repo.find({
      where: [
        { name: ILike(`%${keyword}%`), isDeleted: false },
        { country: ILike(`%${keyword}%`), isDeleted: false },
        { region: ILike(`%${keyword}%`), isDeleted: false },
        { description: ILike(`%${keyword}%`), isDeleted: false },
      ],
      relations: {
        tourDestinations: {
          tour: true,
        },
      },
    });

    // Map với await cho mỗi destination
    const destinationsWithCount = await Promise.all(
      destinations.map(async (dest) => {
        const tourDestinations = await dest.tourDestinations;
        const touringCount = tourDestinations ? tourDestinations.length : 0;
        return { ...dest, touringCount };
      }),
    );

    return {
      message: 'Tìm kiếm điểm đến thành công',
      data: destinationsWithCount,
      total: destinationsWithCount.length,
    };
  }
}
