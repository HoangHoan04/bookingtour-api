import { Injectable, NotFoundException } from '@nestjs/common';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { BannerEntity } from 'src/entities/blogs/banner.entity';
import { transformKeys } from 'src/helpers';
import { FileArchivalRepository } from 'src/repositories';
import { BannerRepository } from 'src/repositories/blog.repository';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { FileArchivalCreateDto } from '../fileArchival/dto';
import { FileArchivalService } from '../fileArchival/fileArchival.service';
import { CreateBannerDto, UpdateBannerDto } from './dto';
@Injectable()
export class BannerService {
  constructor(
    private readonly repo: BannerRepository,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalService: FileArchivalService,
    private readonly fileArchivalRepo: FileArchivalRepository,
  ) {}

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
      relations: {
        image: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy banner');
    }

    const data = transformKeys(result);

    return {
      message: 'Tìm kiếm banner thành công',
      data,
    };
  }

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        title: true,
      },
    });
    return res;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<BannerEntity> = {};

    if (data.where.title) whereCon.title = ILike(`%${data.where.title}%`);
    if (data.where.titleEn) whereCon.titleEn = ILike(`%${data.where.titleEn}%`);
    if (data.where.type) whereCon.type = ILike(`%${data.where.type}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [banners, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: banners,
      total,
    };
  }

  async create(user: UserDto, createDto: CreateBannerDto) {
    const banner = new BannerEntity();
    banner.id = uuidv4();
    banner.title = createDto.title;
    banner.titleEn = createDto.titleEn;
    banner.type = createDto.type;
    banner.url = createDto.url;
    banner.displayOrder = createDto.displayOrder || 0;
    banner.isVisible = createDto.isVisible;
    banner.effectiveStartDate = createDto.effectiveStartDate;
    banner.effectiveEndDate = createDto.effectiveEndDate;
    banner.status = enumData.BANNER_STATUS.FRESHLY_CREATED.code;
    banner.createdBy = user.id;
    banner.createdAt = new Date();

    await this.repo.insert(banner);

    const images = Array.isArray(createDto.image)
      ? createDto.image[0]
      : createDto.image;
    if (images?.fileUrl && images?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: images.fileUrl,
        fileName: images.fileName,
        fileType: 'BANNER_IMAGE',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'bannerId',
        fileRelationId: banner.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: banner.id,
      functionType: 'Banner',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới banner: ${banner.title}`,
      oldData: '{}',
      newData: JSON.stringify(banner),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới banner thành công',
    };
  }

  async update(updateDto: UpdateBannerDto, user: UserDto) {
    const banner = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!banner) {
      throw new NotFoundException('Không tìm thấy banner');
    }

    const oldBannerData = JSON.stringify(banner);

    const bannerUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.title) bannerUpdateData.title = updateDto.title;
    if (updateDto.titleEn) bannerUpdateData.titleEn = updateDto.titleEn;
    if (updateDto.type) bannerUpdateData.type = updateDto.type;
    if (updateDto.url !== undefined) bannerUpdateData.url = updateDto.url;
    if (updateDto.displayOrder !== undefined)
      bannerUpdateData.displayOrder = updateDto.displayOrder;
    if (updateDto.isVisible !== undefined)
      bannerUpdateData.isVisible = updateDto.isVisible;
    if (updateDto.effectiveStartDate)
      bannerUpdateData.effectiveStartDate = updateDto.effectiveStartDate;
    if (updateDto.effectiveEndDate !== undefined)
      bannerUpdateData.effectiveEndDate = updateDto.effectiveEndDate;
    if (updateDto.status) bannerUpdateData.status = updateDto.status;

    if (Object.prototype.hasOwnProperty.call(updateDto, 'image')) {
      await this.fileArchivalRepo.delete({ bannerId: updateDto.id });

      const imageData = Array.isArray(updateDto.image)
        ? updateDto.image[0]
        : updateDto.image;
      if (imageData?.fileUrl && imageData?.fileName) {
        const fileArchival = new FileArchivalCreateDto();
        fileArchival.createdBy = user.id;
        fileArchival.fileUrl = imageData.fileUrl;
        fileArchival.fileName = imageData.fileName;
        fileArchival.fileRelationName = 'bannerId';
        fileArchival.fileRelationId = banner.id;
        await this.fileArchivalService.create(fileArchival);
      }
    }

    await this.repo.update(banner.id, bannerUpdateData);

    const updatedBanner = await this.repo.findOne({
      where: { id: banner.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: banner.id,
      functionType: 'Banner',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật banner: ${banner.title}`,
      oldData: oldBannerData,
      newData: JSON.stringify(updatedBanner),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật banner thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const banner = await this.repo.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException('Không tìm thấy banner');
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: banner.id,
      functionType: 'Banner',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động banner với tiêu đề: ${banner.title}`,
      oldData: JSON.stringify(banner),
      newData: JSON.stringify({
        ...banner,
        isDeleted: true,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Ngừng hoạt động banner thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const banner = await this.repo.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException('Không tìm thấy banner');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: banner.id,
      functionType: 'Banner',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt banner với tiêu đề: ${banner.title}`,
      oldData: JSON.stringify(banner),
      newData: JSON.stringify({
        ...banner,
        isDeleted: false,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt banner thành công',
    };
  }

  async findByIds(ids: string[]): Promise<BannerEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }
}
