import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import slugify from 'slugify';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { TourDetailEntity, TourEntity } from 'src/entities';
import {
  ReviewRepository,
  TourDetailRepository,
  TourRepository,
} from 'src/repositories';
import { FindOptionsWhere, ILike, In, MoreThan } from 'typeorm';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreateTourDto } from './dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { GenerateCodeHelper } from 'src/helpers/generateCodeHelper';
import { CodeType } from 'src/helpers/generateCode.config';

@Injectable()
export class TourService {
  constructor(
    private readonly repo: TourRepository,
    private readonly tourDetailRepo: TourDetailRepository,
    private readonly actionLogService: ActionLogService,
    private readonly reviewRepo: ReviewRepository,
  ) {}

  async findById(id: string) {
    const tour = await this.repo.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: {
        tourDetails: true,
        reviews: true,
        tourDestinations: true,
      },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour');
    }
    return tour;
  }

  async findTourBySlug(slug: string) {
    const tour = await this.repo.findOne({
      where: { slug, isDeleted: false },
      relations: {
        tourDetails: {
          tourPrice: true,
        },
        reviews: true,
        tourDestinations: true,
      },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour');
    }

    await this.incrementViewCount(tour.id);

    return tour;
  }

  async findByCode(code: string) {
    const tour = await this.repo.findOne({
      where: { code, isDeleted: false },
    });
    return tour;
  }

  async findByTags(tags: string[]) {
    const tours = await this.repo.find({
      where: {
        tags: In(tags),
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
      },
      order: { createdAt: 'DESC' },
    });
    return tours;
  }

  async findByCategory(category: string) {
    const tours = await this.repo.find({
      where: {
        category,
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
      },
      order: { rating: 'DESC', createdAt: 'DESC' },
    });
    return tours;
  }

  async findByLocation(location: string) {
    const tours = await this.repo.find({
      where: {
        location: ILike(`%${location}%`),
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
      },
      order: { rating: 'DESC' },
    });
    return tours;
  }

  async findAll(includeDeleted = false) {
    const whereCondition: any = {};
    if (!includeDeleted) {
      whereCondition.isDeleted = false;
    }

    const tours = await this.repo.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      relations: {
        tourDetails: {
          tourPrice: true,
        },
      },
    });
    return tours;
  }

  async findActiveTours() {
    const tours = await this.repo.find({
      where: {
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
      },
      order: { rating: 'DESC', createdAt: 'DESC' },
    });
    return tours;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<TourEntity> = {};

    if (data.where.title) whereCon.title = ILike(`%${data.where.title}%`);
    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.location)
      whereCon.location = ILike(`%${data.where.location}%`);
    if (data.where.category) whereCon.category = data.where.category;
    if (data.where.status) whereCon.status = data.where.status;
    if (data.where.tags && data.where.tags.length > 0)
      whereCon.tags = In(data.where.tags);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [tours, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        tourDetails: {
          tourPrice: true,
        },
      },
    });

    return {
      data: tours,
      total,
      page: Math.ceil(data.skip / data.take) + 1,
      pageSize: data.take,
      totalPages: Math.ceil(total / data.take),
    };
  }

  async createTour(dto: CreateTourDto, user: UserDto) {
    // Kiểm tra title đã tồn tại
    const existingTitle = await this.repo.findOne({
      where: { title: dto.title },
    });
    if (existingTitle) {
      throw new BadRequestException('Tiêu đề tour đã tồn tại');
    }

    const tour = new TourEntity();
    tour.code = await GenerateCodeHelper.generate(CodeType.TOUR, this.repo);
    tour.title = dto.title;
    tour.slug = slugify(dto.title, { lower: true, strict: true });
    tour.location = dto.location;
    tour.durations = dto.durations;
    tour.shortDescription = dto.shortDescription;
    tour.longDescription = dto.longDescription || undefined;
    tour.highlights = dto.highlights || undefined;
    tour.included = dto.included || undefined;
    tour.excluded = dto.excluded || undefined;
    tour.category = dto.category || undefined;
    tour.tags = dto.tags || [];
    tour.status = enumData.TOUR_STATUS.ACTIVE.code;
    tour.rating = 0;
    tour.reviewCount = 0;
    tour.viewCount = 0;
    tour.bookingCount = 0;
    tour.createdBy = user.id;
    tour.createdAt = new Date();

    const savedTour = await this.repo.save(tour);

    // Tạo tour details nếu có
    const createdTourDetails: TourDetailEntity[] = [];
    if (dto.tourDetails && dto.tourDetails.length > 0) {
      for (const detailDto of dto.tourDetails) {
        const tourDetail = new TourDetailEntity();
        tourDetail.tourId = savedTour.id;
        tourDetail.code = await GenerateCodeHelper.generate(
          CodeType.TOUR_DETAIL,
          this.tourDetailRepo,
        );
        tourDetail.startDay = detailDto.startDay;
        tourDetail.endDay = detailDto.endDay;
        tourDetail.startLocation = detailDto.startLocation;
        tourDetail.capacity = detailDto.capacity;
        tourDetail.remainingSeats = detailDto.capacity; // Ban đầu = capacity
        tourDetail.status =
          detailDto.status || enumData.TOUR_STATUS.ACTIVE.code;
        tourDetail.tourGuideId = detailDto.tourGuideId;
        tourDetail.createdBy = user.id;
        tourDetail.createdAt = new Date();

        const savedDetail = await this.tourDetailRepo.save(tourDetail);
        createdTourDetails.push(savedDetail);
      }
    }

    // Log action
    const actionLogDto: ActionLogCreateDto = {
      functionId: savedTour.id,
      functionType: 'Tour',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới tour: ${tour.title}${createdTourDetails.length > 0 ? ` với ${createdTourDetails.length} chuyến đi` : ''}`,
      oldData: '{}',
      newData: JSON.stringify({
        tour: savedTour,
        tourDetails: createdTourDetails,
      }),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới tour thành công',
      data: {
        tour: savedTour,
        tourDetails: createdTourDetails,
      },
    };
  }

  /**
   * Generate mã tour detail unique
   */

  async updateTour(dto: UpdateTourDto, user: UserDto) {
    const tour = await this.repo.findOne({
      where: { id: dto.id, isDeleted: false },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour');
    }

    const oldData = { ...tour };

    if (dto.title && dto.title !== tour.title) {
      const existingTitle = await this.repo.findOne({
        where: { title: dto.title },
      });
      if (existingTitle && existingTitle.id !== tour.id) {
        throw new BadRequestException('Tiêu đề tour đã tồn tại');
      }
      tour.slug = slugify(dto.title, { lower: true, strict: true });
    }

    if (dto.title) tour.title = dto.title;
    if (dto.location) tour.location = dto.location;
    if (dto.durations) tour.durations = dto.durations;
    if (dto.shortDescription) tour.shortDescription = dto.shortDescription;
    if (dto.longDescription !== undefined)
      tour.longDescription = dto.longDescription;
    if (dto.highlights !== undefined) tour.highlights = dto.highlights;
    if (dto.included !== undefined) tour.included = dto.included;
    if (dto.excluded !== undefined) tour.excluded = dto.excluded;
    if (dto.category !== undefined) tour.category = dto.category;
    if (dto.tags !== undefined) tour.tags = dto.tags;
    if (dto.status) tour.status = dto.status;

    tour.updatedBy = user.id;
    tour.updatedAt = new Date();

    const updatedTour = await this.repo.save(tour);

    const actionLogDto: ActionLogCreateDto = {
      functionId: tour.id,
      functionType: 'Tour',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật tour: ${tour.title}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(updatedTour),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật tour thành công',
      data: updatedTour,
    };
  }

  async activateTour(user: UserDto, id: string) {
    const tour = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: tour.id,
      functionType: 'Tour',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt tour với tiêu đề: ${tour.title}`,
      oldData: JSON.stringify(tour),
      newData: JSON.stringify({
        ...tour,
        isDeleted: false,
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt tour thành công',
    };
  }

  async deactivateTour(user: UserDto, id: string) {
    const tour = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour');
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: tour.id,
      functionType: 'Tour',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động tour với tiêu đề: ${tour.title}`,
      oldData: JSON.stringify(tour),
      newData: JSON.stringify({
        ...tour,
        isDeleted: true,
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động tour thành công',
    };
  }

  async changeStatus(id: string, status: string, user: UserDto) {
    const tour = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!tour) {
      throw new NotFoundException('Không tìm thấy tour');
    }

    const oldStatus = tour.status;
    tour.status = status;
    tour.updatedBy = user.id;
    tour.updatedAt = new Date();

    await this.repo.save(tour);

    const actionLogDto: ActionLogCreateDto = {
      functionId: tour.id,
      functionType: 'Tour',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Thay đổi trạng thái tour "${tour.title}" từ ${oldStatus} sang ${status}`,
      oldData: JSON.stringify({ status: oldStatus }),
      newData: JSON.stringify({ status }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Thay đổi trạng thái tour thành công',
    };
  }

  async incrementViewCount(id: string) {
    await this.repo.increment({ id }, 'viewCount', 1);
  }

  async incrementBookingCount(id: string) {
    await this.repo.increment({ id }, 'bookingCount', 1);
  }

  async updateRatingStats(tourId: string) {
    const reviews = await this.reviewRepo.find({
      where: {
        tourId,
        isDeleted: false,
        status: enumData.REVIEW_STATUS.APPROVED.code,
      },
    });

    const reviewCount = reviews.length;
    const rating =
      reviewCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    await this.repo.update(tourId, {
      rating: Math.round(rating * 10) / 10,
      reviewCount,
    });

    return { rating, reviewCount };
  }

  async searchTours(params: {
    keyword?: string;
    location?: string;
    category?: string;
    tags?: string[];
    minRating?: number;
    maxRating?: number;
    status?: string;
    sortBy?: 'rating' | 'viewCount' | 'bookingCount' | 'createdAt';
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }) {
    const {
      keyword,
      location,
      category,
      tags,
      minRating,
      maxRating,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = params;

    const queryBuilder = this.repo.createQueryBuilder('tour');

    // Base conditions
    queryBuilder.where('tour.isDeleted = :isDeleted', { isDeleted: false });

    // Keyword search
    if (keyword) {
      queryBuilder.andWhere(
        '(tour.title ILIKE :keyword OR tour.code ILIKE :keyword OR tour.shortDescription ILIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // Location filter
    if (location) {
      queryBuilder.andWhere('tour.location ILIKE :location', {
        location: `%${location}%`,
      });
    }

    // Category filter
    if (category) {
      queryBuilder.andWhere('tour.category = :category', { category });
    }

    // Tags filter
    if (tags && tags.length > 0) {
      queryBuilder.andWhere('tour.tags && :tags', { tags });
    }

    // Rating filter
    if (minRating !== undefined) {
      queryBuilder.andWhere('tour.rating >= :minRating', { minRating });
    }
    if (maxRating !== undefined) {
      queryBuilder.andWhere('tour.rating <= :maxRating', { maxRating });
    }

    // Status filter
    if (status) {
      queryBuilder.andWhere('tour.status = :status', { status });
    }

    // Sorting
    queryBuilder.orderBy(`tour.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [tours, total] = await queryBuilder.getManyAndCount();

    return {
      data: tours,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPopularTours(limit = 10) {
    const tours = await this.repo.find({
      where: {
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
      },
      order: {
        viewCount: 'DESC',
        rating: 'DESC',
      },
      take: limit,
    });
    return tours;
  }

  async getTopRatedTours(limit = 10) {
    const tours = await this.repo.find({
      where: {
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
        reviewCount: MoreThan(0),
      },
      order: {
        rating: 'DESC',
        reviewCount: 'DESC',
      },
      take: limit,
    });
    return tours;
  }

  async getNewestTours(limit = 10) {
    const tours = await this.repo.find({
      where: {
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
    });
    return tours;
  }

  async getMostBookedTours(limit = 10) {
    const tours = await this.repo.find({
      where: {
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
      },
      order: {
        bookingCount: 'DESC',
      },
      take: limit,
    });
    return tours;
  }

  async getRelatedTours(tourId: string, limit = 5) {
    const tour = await this.findById(tourId);

    const tours = await this.repo
      .createQueryBuilder('tour')
      .where('tour.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('tour.status = :status', {
        status: enumData.TOUR_STATUS.ACTIVE.code,
      })
      .andWhere('tour.id != :tourId', { tourId })
      .andWhere(
        '(tour.category = :category OR tour.location ILIKE :location)',
        {
          category: tour.category,
          location: `%${tour.location}%`,
        },
      )
      .orderBy('tour.rating', 'DESC')
      .take(limit)
      .getMany();

    return tours;
  }

  async getToursByPriceRange(minPrice: number, maxPrice: number) {
    const tours = await this.repo
      .createQueryBuilder('tour')
      .innerJoin('tour.tourDetails', 'tourDetail')
      .innerJoin('tourDetail.tourPrice', 'tourPrice')
      .where('tour.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('tour.status = :status', {
        status: enumData.TOUR_STATUS.ACTIVE.code,
      })
      .andWhere('tourPrice.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      })
      .distinct(true)
      .getMany();

    return tours;
  }

  async selectBoxTour() {
    const tours = await this.repo.find({
      where: {
        isDeleted: false,
        status: enumData.TOUR_STATUS.ACTIVE.code,
      },
      select: {
        id: true,
        code: true,
        title: true,
      },
      order: { title: 'ASC' },
    });

    return tours;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repo.count({
      where: { id, isDeleted: false },
    });
    return count > 0;
  }

  async getAllCategories() {
    const result = await this.repo
      .createQueryBuilder('tour')
      .select('DISTINCT tour.category', 'category')
      .where('tour.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('tour.category IS NOT NULL')
      .getRawMany();

    return result.map((item) => item.category).filter(Boolean);
  }

  async getAllLocations() {
    const result = await this.repo
      .createQueryBuilder('tour')
      .select('DISTINCT tour.location', 'location')
      .where('tour.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('tour.location IS NOT NULL')
      .getRawMany();

    return result.map((item) => item.location).filter(Boolean);
  }

  async getAllTags() {
    const tours = await this.repo.find({
      where: { isDeleted: false },
      select: ['tags'],
    });

    const allTags = new Set<string>();
    tours.forEach((tour) => {
      if (tour.tags && Array.isArray(tour.tags)) {
        tour.tags.forEach((tag) => allTags.add(tag));
      }
    });

    return Array.from(allTags).sort();
  }

  async isSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    const whereCondition: any = { slug, isDeleted: false };

    const tour = await this.repo.findOne({
      where: whereCondition,
    });

    if (!tour) return false;
    if (excludeId && tour.id === excludeId) return false;

    return true;
  }

  async generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
    let slug = slugify(title, { lower: true, strict: true });
    let counter = 1;

    while (await this.isSlugExists(slug, excludeId)) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      counter++;
    }

    return slug;
  }
}
