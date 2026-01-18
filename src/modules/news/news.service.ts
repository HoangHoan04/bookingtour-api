import { Injectable, NotFoundException } from '@nestjs/common';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { NewsEntity } from 'src/entities/blogs/new.entity';
import { transformKeys } from 'src/helpers';
import { FileArchivalRepository } from 'src/repositories';
import { NewsRepository } from 'src/repositories/blog.repository';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { FileArchivalCreateDto } from '../fileArchival/dto';
import { FileArchivalService } from '../fileArchival/fileArchival.service';
import { CreateNewsDto, UpdateNewsDto } from './dto';

@Injectable()
export class NewsService {
  constructor(
    private readonly repo: NewsRepository,
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
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const data = transformKeys(result);

    return {
      message: 'Tìm kiếm bài viết thành công',
      data,
    };
  }

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
      },
    });
    return res;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<NewsEntity> = {};

    if (data.where.titleVI) whereCon.titleVI = ILike(`%${data.where.titleVI}%`);
    if (data.where.titleEN) whereCon.titleEN = ILike(`%${data.where.titleEN}%`);
    if (data.where.type) whereCon.type = ILike(`%${data.where.type}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [News, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: News,
      total,
    };
  }

  async create(createDto: CreateNewsDto, user: UserDto) {
    const news = new NewsEntity();
    news.id = uuidv4();
    news.titleVI = createDto.titleVI;
    news.titleEN = createDto.titleEN;
    news.contentVI = createDto.contentVI;
    news.contentEN = createDto.contentEN;
    news.type = createDto.type;
    news.url = createDto.url;
    news.effectiveStartDate = createDto.effectiveStartDate;
    news.effectiveEndDate = createDto.effectiveEndDate;
    news.status = enumData.NEW_STATUS.FRESHLY_CREATED.code;
    news.rank = createDto.rank;
    news.isVisible = createDto.isVisible;
    news.createdBy = user.id;
    news.createdAt = new Date();

    await this.repo.insert(news);

    const images = Array.isArray(createDto.images)
      ? createDto.images[0]
      : createDto.images;
    if (images?.fileUrl && images?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: images.fileUrl,
        fileName: images.fileName,
        fileType: 'NEW_IMAGE',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'NewId',
        fileRelationId: news.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: news.id,
      functionType: 'New',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới New: ${news.titleVI}`,
      oldData: '{}',
      newData: JSON.stringify(news),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới New thành công',
    };
  }

  async update(data: UpdateNewsDto, user: UserDto) {
    const news = await this.repo.findOne({ where: { id: data.id } });
    if (!news) {
      throw new NotFoundException('Không tìm thấy New');
    }

    const oldNewData = JSON.stringify(news);

    const newsUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (data.titleVI) newsUpdateData.titleVI = data.titleVI;
    if (data.titleEN) newsUpdateData.titleEN = data.titleEN;
    if (data.type) newsUpdateData.type = data.type;
    if (data.url !== undefined) newsUpdateData.url = data.url;
    if (data.contentVI) newsUpdateData.contentVI = data.contentVI;
    if (data.contentEN) newsUpdateData.contentEN = data.contentEN;
    if (data.code) newsUpdateData.code = data.code;
    if (data.rank !== undefined) newsUpdateData.rank = data.rank;
    if (data.isVisible !== undefined) newsUpdateData.isVisible = data.isVisible;
    if (data.effectiveStartDate)
      newsUpdateData.effectiveStartDate = data.effectiveStartDate;
    if (data.effectiveEndDate !== undefined)
      newsUpdateData.effectiveEndDate = data.effectiveEndDate;
    if (data.status) newsUpdateData.status = data.status;

    if (Object.prototype.hasOwnProperty.call(data, 'images')) {
      await this.fileArchivalRepo.delete({ id: data.id });

      const imageData = Array.isArray(data.images)
        ? data.images[0]
        : data.images;
      if (imageData?.fileUrl && imageData?.fileName) {
        const fileArchival = new FileArchivalCreateDto();
        fileArchival.createdBy = user.id;
        fileArchival.fileUrl = imageData.fileUrl;
        fileArchival.fileName = imageData.fileName;
        fileArchival.fileRelationName = 'NewId';
        fileArchival.fileRelationId = news.id;
        await this.fileArchivalService.create(fileArchival);
      }
    }

    await this.repo.update(news.id, newsUpdateData);

    const updatedNew = await this.repo.findOne({
      where: { id: news.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: news.id,
      functionType: 'New',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật New: ${news.titleVI}`,
      oldData: oldNewData,
      newData: JSON.stringify(updatedNew),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật tin tức thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const news = await this.repo.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException('Không tìm thấy New');
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: news.id,
      functionType: 'New',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động New với tiêu đề: ${news.titleVI}`,
      oldData: JSON.stringify(news),
      newData: JSON.stringify({
        ...news,
        isDeleted: true,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Ngừng hoạt động New thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const news = await this.repo.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException('Không tìm thấy New');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: news.id,
      functionType: 'New',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt New với tiêu đề: ${news.titleVI}`,
      oldData: JSON.stringify(news),
      newData: JSON.stringify({
        ...news,
        isDeleted: false,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt New thành công',
    };
  }

  async findByIds(ids: string[]): Promise<NewsEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }
}
