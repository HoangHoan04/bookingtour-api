import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { enumData } from 'src/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { DepartmentTypeEntity } from 'src/entities/tour';
import { DepartmentTypeRepository } from 'src/repositories/hr.repository';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreateDepartmentTypeDto, UpdateDepartmentTypeDto } from './dto';

@Injectable()
export class DepartmentTypeService {
  constructor(
    private readonly repo: DepartmentTypeRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async create(user: UserDto, createDto: CreateDepartmentTypeDto) {
    const existingCode = await this.repo.findOne({
      where: { code: createDto.code, isDeleted: false },
    });
    if (existingCode) {
      throw new BadRequestException('Mã loại phòng ban đã tồn tại');
    }

    const departmentType = new DepartmentTypeEntity();
    departmentType.id = uuidv4();
    departmentType.code = createDto.code;
    departmentType.name = createDto.name;
    departmentType.description = createDto.description;
    departmentType.createdBy = user.id;
    departmentType.createdAt = new Date();

    await this.repo.insert(departmentType);

    const actionLogDto: ActionLogCreateDto = {
      functionId: departmentType.id,
      functionType: 'DepartmentType',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới loại phòng ban: ${departmentType.code} - ${departmentType.name}`,
      oldData: '{}',
      newData: JSON.stringify(departmentType),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới loại phòng ban thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdateDepartmentTypeDto) {
    const departmentType = await this.repo.findOne({
      where: { id: updateDto.id, isDeleted: false },
    });

    if (!departmentType) {
      throw new NotFoundException('Không tìm thấy loại phòng ban');
    }

    if (updateDto.code && updateDto.code !== departmentType.code) {
      const existingCode = await this.repo.findOne({
        where: {
          code: updateDto.code,
          isDeleted: false,
          id: Not(updateDto.id),
        },
      });
      if (existingCode) {
        throw new BadRequestException('Mã loại phòng ban đã tồn tại');
      }
    }

    const oldData = { ...departmentType };

    const departmentTypeUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.code) departmentTypeUpdateData.code = updateDto.code;
    if (updateDto.name) departmentTypeUpdateData.name = updateDto.name;
    if (updateDto.description)
      departmentTypeUpdateData.description = updateDto.description;

    await this.repo.update(updateDto.id, departmentTypeUpdateData);

    const newData = await this.repo.findOne({ where: { id: updateDto.id } });

    const actionLogDto: ActionLogCreateDto = {
      functionId: departmentType.id,
      functionType: 'DepartmentType',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật loại phòng ban: ${departmentType.code}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật loại phòng ban thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const departmentType = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: { departments: true },
    });

    if (!departmentType) {
      throw new NotFoundException('Không tìm thấy loại phòng ban');
    }

    if (
      departmentType.departments &&
      (await departmentType.departments).length > 0
    ) {
      throw new BadRequestException(
        'Không thể ngừng hoạt động loại phòng ban đang có dữ liệu liên kết (Phòng ban)',
      );
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'DepartmentType',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động loại phòng ban: ${departmentType.code} - ${departmentType.name}`,
      oldData: JSON.stringify(departmentType),
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động loại phòng ban thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const departmentType = await this.repo.findOne({
      where: { id },
    });

    if (!departmentType) {
      throw new NotFoundException('Không tìm thấy loại phòng ban');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'DepartmentType',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt loại phòng ban: ${departmentType.code}`,
      oldData: JSON.stringify(departmentType),
      newData: JSON.stringify({ ...departmentType, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt loại phòng ban thành công',
    };
  }

  async findById(id: string) {
    const departmentType = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        departments: true,
      },
    });

    if (!departmentType) {
      throw new NotFoundException('Không tìm thấy loại phòng ban');
    }

    return {
      message: 'Lấy thông tin loại phòng ban thành công',
      data: departmentType,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<DepartmentTypeEntity> = {
      isDeleted: false,
    };

    if (data.where.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }
    if (data.where.name) {
      whereCon.name = ILike(`%${data.where.name}%`);
    }

    const [departmentTypes, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: departmentTypes,
      total,
    };
  }

  async selectBox() {
    const departmentTypes = await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true },
      order: { name: 'ASC' },
    });

    return departmentTypes;
  }
}
