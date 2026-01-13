import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { enumData } from 'src/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { PartEntity } from 'src/entities/tour';
import { PartRepository } from 'src/repositories/hr.repository';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreatePartDto, UpdatePartDto } from './dto';

@Injectable()
export class PartService {
  constructor(
    private readonly repo: PartRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async create(user: UserDto, createDto: CreatePartDto) {
    const existingCode = await this.repo.findOne({
      where: { code: createDto.code, isDeleted: false },
    });
    if (existingCode) {
      throw new BadRequestException('Mã bộ phận đã tồn tại');
    }

    const part = new PartEntity();
    part.id = uuidv4();
    part.code = createDto.code;
    part.name = createDto.name;
    part.description = createDto.description;
    part.partMasterId = createDto.partMasterId;
    part.departmentId = createDto.departmentId;
    part.companyId = createDto.companyId;
    part.branchId = createDto.branchId;
    part.createdBy = user.id;
    part.createdAt = new Date();

    await this.repo.insert(part);

    const actionLogDto: ActionLogCreateDto = {
      functionId: part.id,
      functionType: 'Part',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới bộ phận: ${part.code} - ${part.name}`,
      oldData: '{}',
      newData: JSON.stringify(part),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới bộ phận thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdatePartDto) {
    const part = await this.repo.findOne({
      where: { id: updateDto.id, isDeleted: false },
    });

    if (!part) {
      throw new NotFoundException('Không tìm thấy bộ phận');
    }

    if (updateDto.code && updateDto.code !== part.code) {
      const existingCode = await this.repo.findOne({
        where: {
          code: updateDto.code,
          isDeleted: false,
          id: Not(updateDto.id),
        },
      });
      if (existingCode) {
        throw new BadRequestException('Mã bộ phận đã tồn tại');
      }
    }

    const oldData = { ...part };

    const partUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.code) partUpdateData.code = updateDto.code;
    if (updateDto.name) partUpdateData.name = updateDto.name;
    if (updateDto.description !== undefined)
      partUpdateData.description = updateDto.description;
    if (updateDto.partMasterId)
      partUpdateData.partMasterId = updateDto.partMasterId;
    if (updateDto.departmentId)
      partUpdateData.departmentId = updateDto.departmentId;
    if (updateDto.companyId) partUpdateData.companyId = updateDto.companyId;
    if (updateDto.branchId) partUpdateData.branchId = updateDto.branchId;

    await this.repo.update(updateDto.id, partUpdateData);

    const newData = await this.repo.findOne({ where: { id: updateDto.id } });

    const actionLogDto: ActionLogCreateDto = {
      functionId: part.id,
      functionType: 'Part',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật bộ phận: ${part.code}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật bộ phận thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const part = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        positions: true,
        employees: true,
      },
    });

    if (!part) {
      throw new NotFoundException('Không tìm thấy bộ phận');
    }

    if (
      (part.positions && (await part.positions).length > 0) ||
      (part.employees && (await part.employees).length > 0)
    ) {
      throw new BadRequestException(
        'Không thể ngừng hoạt động bộ phận đang có dữ liệu liên kết (Chức vụ/Nhân viên)',
      );
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Part',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động bộ phận: ${part.code} - ${part.name}`,
      oldData: JSON.stringify(part),
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động bộ phận thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const part = await this.repo.findOne({
      where: { id },
    });

    if (!part) {
      throw new NotFoundException('Không tìm thấy bộ phận');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Part',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt bộ phận: ${part.code}`,
      oldData: JSON.stringify(part),
      newData: JSON.stringify({ ...part, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt bộ phận thành công',
    };
  }

  async findById(id: string) {
    const part = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        employees: true,
        positions: true,
        partMaster: true,
        department: true,
        company: true,
        branch: true,
      },
    });

    if (!part) {
      throw new NotFoundException('Không tìm thấy bộ phận');
    }

    return {
      message: 'Lấy thông tin bộ phận thành công',
      data: part,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<PartEntity> = {
      isDeleted: false,
    };

    if (data.where.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }
    if (data.where.name) {
      whereCon.name = ILike(`%${data.where.name}%`);
    }
    if (data.where.partMasterId) {
      whereCon.partMasterId = data.where.partMasterId;
    }
    if (data.where.departmentId) {
      whereCon.departmentId = data.where.departmentId;
    }
    if (data.where.companyId) {
      whereCon.companyId = data.where.companyId;
    }
    if (data.where.branchId) {
      whereCon.branchId = data.where.branchId;
    }
    if ([true, false].includes(data.where.isDeleted)) {
      whereCon.isDeleted = data.where.isDeleted;
    }

    const [parts, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      relations: ['department', 'partMaster', 'branch'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: parts,
      total,
    };
  }

  async selectBox() {
    const parts = await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true },
      order: { name: 'ASC' },
    });

    return parts;
  }
}
