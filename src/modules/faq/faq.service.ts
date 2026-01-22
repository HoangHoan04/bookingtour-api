import { Injectable, NotFoundException } from '@nestjs/common';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { FaqEntity } from 'src/entities';
import { transformKeys } from 'src/helpers';
import { FaqRepository } from 'src/repositories/blog.repository';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreateFaqDto, UpdateFaqDto } from './dto';

@Injectable()
export class FaqService {
  constructor(
    private readonly repo: FaqRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy FAQ');
    }

    const data = transformKeys(result);

    return {
      message: 'Tìm kiếm FAQ thành công',
      data,
    };
  }

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        question: true,
      },
    });
    return res;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<FaqEntity> = {};

    if (data.where.question)
      whereCon.question = ILike(`%${data.where.question}%`);
    if (data.where.category)
      whereCon.category = ILike(`%${data.where.category}%`);
    if (data.where.status) whereCon.status = ILike(`%${data.where.status}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [faqs, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });

    return {
      data: faqs,
      total,
    };
  }

  async create(createDto: CreateFaqDto, user: UserDto) {
    const faq = new FaqEntity();
    faq.id = uuidv4();
    faq.question = createDto.question;
    faq.answer = createDto.answer;
    faq.category = createDto.category;
    faq.displayOrder = createDto.displayOrder;
    faq.tags = createDto.tags;
    faq.status = createDto.status;
    faq.viewCount = 0;
    faq.isHelpful = 0;
    faq.createdBy = user.id;
    faq.createdAt = new Date();

    await this.repo.insert(faq);

    const actionLogDto: ActionLogCreateDto = {
      functionId: faq.id,
      functionType: 'Faq',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới FAQ: ${faq.question}`,
      oldData: '{}',
      newData: JSON.stringify(faq),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới FAQ thành công',
    };
  }

  async update(data: UpdateFaqDto, user: UserDto) {
    const faq = await this.repo.findOne({ where: { id: data.id } });
    if (!faq) {
      throw new NotFoundException('Không tìm thấy FAQ');
    }

    const oldFaqData = JSON.stringify(faq);

    const faqUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (data.question) faqUpdateData.question = data.question;
    if (data.answer) faqUpdateData.answer = data.answer;
    if (data.category) faqUpdateData.category = data.category;
    if (data.displayOrder !== undefined)
      faqUpdateData.displayOrder = data.displayOrder;
    if (data.tags !== undefined) faqUpdateData.tags = data.tags;
    if (data.status) faqUpdateData.status = data.status;

    await this.repo.update(faq.id, faqUpdateData);

    const updatedFaq = await this.repo.findOne({
      where: { id: faq.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: faq.id,
      functionType: 'Faq',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật FAQ: ${faq.question}`,
      oldData: oldFaqData,
      newData: JSON.stringify(updatedFaq),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật FAQ thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const faq = await this.repo.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException('Không tìm thấy FAQ');
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: faq.id,
      functionType: 'Faq',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động FAQ: ${faq.question}`,
      oldData: JSON.stringify(faq),
      newData: JSON.stringify({
        ...faq,
        isDeleted: true,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Ngừng hoạt động FAQ thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const faq = await this.repo.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException('Không tìm thấy FAQ');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedAt: new Date(),
      updatedBy: user.id,
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: faq.id,
      functionType: 'Faq',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt FAQ: ${faq.question}`,
      oldData: JSON.stringify(faq),
      newData: JSON.stringify({
        ...faq,
        isDeleted: false,
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt FAQ thành công',
    };
  }

  async findByIds(ids: string[]): Promise<FaqEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }
}
