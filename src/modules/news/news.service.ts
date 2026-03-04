import { Injectable, NotFoundException } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
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
import { FileArchivalCreateDto } from '../file-archival/dto';
import { FileArchivalService } from '../file-archival/file-archival.service';
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

  private genCodeNew() {
    const generate = customAlphabet('0123456789', 3);
    return `NEW${generate()}`;
  }

  async create(createDto: CreateNewsDto, user: UserDto) {
    const news = new NewsEntity();
    news.id = uuidv4();
    news.code = this.genCodeNew();
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
        fileRelationName: 'newId',
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
      await this.fileArchivalRepo.delete({ newId: data.id });

      const imageData = Array.isArray(data.images)
        ? data.images[0]
        : data.images;
      if (imageData?.fileUrl && imageData?.fileName) {
        const fileArchival = new FileArchivalCreateDto();
        fileArchival.createdBy = user.id;
        fileArchival.fileUrl = imageData.fileUrl;
        fileArchival.fileName = imageData.fileName;
        fileArchival.fileRelationName = 'newId';
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

  /**
   * Lấy danh sách tin tức công khai (cho web user)
   * Chỉ trả về tin tức đang hiển thị, chưa bị xóa, và đang trong thời gian hiệu lực
   */
  async getPublicNews(data: PaginationDto) {
    const currentDate = new Date();
    const whereCon: FindOptionsWhere<NewsEntity> = {
      isDeleted: false,
      isVisible: true,
    };

    if (data.where.type) {
      whereCon.type = data.where.type;
    }

    if (data.where.titleVI) {
      whereCon.titleVI = ILike(`%${data.where.titleVI}%`);
    }
    if (data.where.titleEN) {
      whereCon.titleEN = ILike(`%${data.where.titleEN}%`);
    }

    const [news, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: {
        images: true,
      },
      skip: data.skip,
      take: data.take,
      order: {
        rank: 'ASC',
        createdAt: 'DESC',
      },
    });

    const validNews = news.filter((item) => {
      const isAfterStart =
        !item.effectiveStartDate ||
        new Date(item.effectiveStartDate) <= currentDate;
      const isBeforeEnd =
        !item.effectiveEndDate ||
        new Date(item.effectiveEndDate) >= currentDate;
      return isAfterStart && isBeforeEnd;
    });

    return {
      message: 'Lấy danh sách tin tức thành công',
      data: validNews,
      total: validNews.length,
    };
  }

  /**
   * Lấy chi tiết tin tức công khai (cho web user)
   */
  async getPublicNewsById(id: string) {
    const news = await this.repo.findOne({
      where: {
        id,
        isDeleted: false,
        isVisible: true,
      },
      relations: {
        images: true,
      },
    });

    if (!news) {
      throw new NotFoundException(
        'Không tìm thấy bài viết hoặc bài viết không khả dụng',
      );
    }

    // Kiểm tra thời gian hiệu lực
    const currentDate = new Date();
    const isAfterStart =
      !news.effectiveStartDate ||
      new Date(news.effectiveStartDate) <= currentDate;
    const isBeforeEnd =
      !news.effectiveEndDate || new Date(news.effectiveEndDate) >= currentDate;

    if (!isAfterStart || !isBeforeEnd) {
      throw new NotFoundException('Bài viết không trong thời gian hiệu lực');
    }

    const data = transformKeys(news);

    return {
      message: 'Lấy chi tiết tin tức thành công',
      data,
    };
  }

  /**
   * Lấy danh sách tin tức nổi bật (có rank, đang hiển thị)
   */
  async getFeaturedNews(limit: number = 5) {
    const currentDate = new Date();

    const news = await this.repo.find({
      where: {
        isDeleted: false,
        isVisible: true,
      },
      relations: {
        images: true,
      },
      order: {
        rank: 'ASC',
        createdAt: 'DESC',
      },
      take: limit,
    });

    // Lọc theo thời gian hiệu lực và có rank
    const featuredNews = news.filter((item) => {
      const hasRank = item.rank !== null && item.rank !== undefined;
      const isAfterStart =
        !item.effectiveStartDate ||
        new Date(item.effectiveStartDate) <= currentDate;
      const isBeforeEnd =
        !item.effectiveEndDate ||
        new Date(item.effectiveEndDate) >= currentDate;
      return hasRank && isAfterStart && isBeforeEnd;
    });

    return {
      message: 'Lấy danh sách tin tức nổi bật thành công',
      data: featuredNews,
      total: featuredNews.length,
    };
  }

  /**
   * Lấy tin tức liên quan (cùng loại, trừ tin hiện tại)
   */
  async getRelatedNews(id: string, limit: number = 4) {
    const currentNews = await this.repo.findOne({
      where: { id },
    });

    if (!currentNews) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    const currentDate = new Date();

    const news = await this.repo.find({
      where: {
        type: currentNews.type,
        isDeleted: false,
        isVisible: true,
      },
      relations: {
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit + 1, // Lấy thêm 1 để loại bỏ tin hiện tại
    });

    // Lọc tin liên quan (loại bỏ tin hiện tại và kiểm tra thời gian hiệu lực)
    const relatedNews = news
      .filter((item) => {
        const isDifferent = item.id !== id;
        const isAfterStart =
          !item.effectiveStartDate ||
          new Date(item.effectiveStartDate) <= currentDate;
        const isBeforeEnd =
          !item.effectiveEndDate ||
          new Date(item.effectiveEndDate) >= currentDate;
        return isDifferent && isAfterStart && isBeforeEnd;
      })
      .slice(0, limit);

    return {
      message: 'Lấy danh sách tin tức liên quan thành công',
      data: relatedNews,
      total: relatedNews.length,
    };
  }

  /**
   * Lấy tin tức mới nhất
   */
  async getLatestNews(limit: number = 10) {
    const currentDate = new Date();

    const news = await this.repo.find({
      where: {
        isDeleted: false,
        isVisible: true,
      },
      relations: {
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });

    // Lọc theo thời gian hiệu lực
    const latestNews = news.filter((item) => {
      const isAfterStart =
        !item.effectiveStartDate ||
        new Date(item.effectiveStartDate) <= currentDate;
      const isBeforeEnd =
        !item.effectiveEndDate ||
        new Date(item.effectiveEndDate) >= currentDate;
      return isAfterStart && isBeforeEnd;
    });

    return {
      message: 'Lấy danh sách tin tức mới nhất thành công',
      data: latestNews.slice(0, limit),
      total: latestNews.length,
    };
  }

  /**
   * Lấy danh sách tin tức theo loại
   */
  async getNewsByType(type: string, data: PaginationDto) {
    const currentDate = new Date();

    const [news, total] = await this.repo.findAndCount({
      where: {
        type,
        isDeleted: false,
        isVisible: true,
      },
      relations: {
        images: true,
      },
      skip: data.skip,
      take: data.take,
      order: {
        rank: 'ASC',
        createdAt: 'DESC',
      },
    });

    // Lọc theo thời gian hiệu lực
    const validNews = news.filter((item) => {
      const isAfterStart =
        !item.effectiveStartDate ||
        new Date(item.effectiveStartDate) <= currentDate;
      const isBeforeEnd =
        !item.effectiveEndDate ||
        new Date(item.effectiveEndDate) >= currentDate;
      return isAfterStart && isBeforeEnd;
    });

    return {
      message: `Lấy danh sách tin tức loại ${type} thành công`,
      data: validNews,
      total: validNews.length,
    };
  }

  /**
   * Tìm kiếm tin tức công khai
   */
  async searchPublicNews(keyword: string, data: PaginationDto) {
    const currentDate = new Date();

    const [news, total] = await this.repo.findAndCount({
      where: [
        {
          titleVI: ILike(`%${keyword}%`),
          isDeleted: false,
          isVisible: true,
        },
        {
          titleEN: ILike(`%${keyword}%`),
          isDeleted: false,
          isVisible: true,
        },
        {
          contentVI: ILike(`%${keyword}%`),
          isDeleted: false,
          isVisible: true,
        },
        {
          contentEN: ILike(`%${keyword}%`),
          isDeleted: false,
          isVisible: true,
        },
      ],
      relations: {
        images: true,
      },
      skip: data.skip,
      take: data.take,
      order: {
        rank: 'ASC',
        createdAt: 'DESC',
      },
    });

    // Lọc theo thời gian hiệu lực
    const validNews = news.filter((item) => {
      const isAfterStart =
        !item.effectiveStartDate ||
        new Date(item.effectiveStartDate) <= currentDate;
      const isBeforeEnd =
        !item.effectiveEndDate ||
        new Date(item.effectiveEndDate) >= currentDate;
      return isAfterStart && isBeforeEnd;
    });

    return {
      message: 'Tìm kiếm tin tức thành công',
      data: validNews,
      total: validNews.length,
      keyword,
    };
  }

  /**
   * Lấy số lượng tin tức theo từng loại
   */
  async getNewsCountByType() {
    const currentDate = new Date();

    const allNews = await this.repo.find({
      where: {
        isDeleted: false,
        isVisible: true,
      },
    });

    // Lọc theo thời gian hiệu lực
    const validNews = allNews.filter((item) => {
      const isAfterStart =
        !item.effectiveStartDate ||
        new Date(item.effectiveStartDate) <= currentDate;
      const isBeforeEnd =
        !item.effectiveEndDate ||
        new Date(item.effectiveEndDate) >= currentDate;
      return isAfterStart && isBeforeEnd;
    });

    // Đếm theo loại
    const countByType = validNews.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      message: 'Lấy số lượng tin tức theo loại thành công',
      data: countByType,
      total: validNews.length,
    };
  }
}
