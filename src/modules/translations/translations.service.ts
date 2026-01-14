import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto, UserDto } from 'src/dto';
import { TranslationEntity } from 'src/entities';
import { TranslationRepository } from 'src/repositories';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreateTranslationDto, UpdateTranslationDto } from './dto';
import { enumData } from 'src/common/constants';

@Injectable()
export class TranslationsService {
  constructor(
    private readonly repo: TranslationRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async create(user: UserDto, data: CreateTranslationDto) {
    const existingKey = await this.repo.findOne({
      where: { key: data.key },
    });
    if (existingKey) {
      throw new Error('Key đã tồn tại');
    }

    const translation = new TranslationEntity();
    translation.id = uuidv4();
    translation.key = data.key;
    translation.en = data.en;
    translation.vi = data.vi;
    translation.createdBy = user.id;
    translation.createdAt = new Date();

    await this.repo.insert(translation);

    const actionLogDto: ActionLogCreateDto = {
      functionId: translation.id,
      functionType: 'Translation',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới bản dịch: ${translation.key} - ${translation.en} / ${translation.vi}`,
      oldData: '{}',
      newData: JSON.stringify(translation),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới bản dịch thành công',
    };
  }

  async update(user: UserDto, data: UpdateTranslationDto) {
    const translation = await this.repo.findOne({
      where: { id: data.id, isDeleted: false },
    });

    if (!translation) {
      throw new NotFoundException('Không tìm thấy bản dịch');
    }

    if (data.key && data.key !== translation.key) {
      const existingKey = await this.repo.findOne({
        where: {
          key: data.key,
          isDeleted: false,
          id: Not(data.id),
        },
      });
      if (existingKey) {
        throw new BadRequestException('Key đã tồn tại');
      }
    }

    const oldData = { ...translation };

    const translationUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (data.key) translationUpdateData.key = data.key;
    if (data.en) translationUpdateData.en = data.en;
    if (data.vi) translationUpdateData.vi = data.vi;

    await this.repo.update(data.id, translationUpdateData);

    const newData = await this.repo.findOne({ where: { id: data.id } });

    const actionLogDto: ActionLogCreateDto = {
      functionId: translation.id,
      functionType: 'Translation',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật bản dịch: ${translation.key}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật bản dịch thành công',
    };
  }

  async delete(user: UserDto, id: string) {
    await this.repo.delete(id);

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Translation',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: '{}',
      newData: '{}',
      description: `Xóa bản dịch với ID: ${id}`,
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Xóa thành công' };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<TranslationEntity> = {
      isDeleted: false,
    };

    if (data.where.key) {
      whereCon.key = data.where.key;
    }

    if (data.where.en) {
      whereCon.en = ILike(`%${data.where.en}%`);
    }

    if (data.where.vi) {
      whereCon.vi = ILike(`%${data.where.vi}%`);
    }

    const [translations, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: translations,
      total,
    };
  }

  async findByKey(key: string) {
    const translation = await this.repo.findOne({
      where: { key, isDeleted: false },
    });

    if (!translation) {
      throw new NotFoundException('Không tìm thấy bản dịch');
    }

    return {
      message: 'Lấy thông tin bản dịch thành công',
      data: translation,
    };
  }
}
