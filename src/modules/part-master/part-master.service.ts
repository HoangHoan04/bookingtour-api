import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { enumData } from 'src/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { BranchPartMasterEntity, PartMasterEntity } from 'src/entities/tour';
import {
  BranchPartMasterRepository,
  PartMasterRepository,
} from 'src/repositories/hr.repository';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreatePartMasterDto, UpdatePartMasterDto } from './dto';

@Injectable()
export class PartMasterService {
  constructor(
    private readonly repo: PartMasterRepository,
    private readonly branchPartMasterRepo: BranchPartMasterRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async create(user: UserDto, createDto: CreatePartMasterDto) {
    const existingCode = await this.repo.findOne({
      where: { code: createDto.code, isDeleted: false },
    });
    if (existingCode) {
      throw new BadRequestException('Mã bộ phận master đã tồn tại');
    }

    const partMaster = new PartMasterEntity();
    partMaster.id = uuidv4();
    partMaster.code = createDto.code;
    partMaster.name = createDto.name;
    partMaster.description = createDto.description;
    partMaster.createdBy = user.id;
    partMaster.createdAt = new Date();

    await this.repo.insert(partMaster);

    if (createDto.branchIds && createDto.branchIds.length > 0) {
      const branchPartMasters: BranchPartMasterEntity[] = [];

      for (const branchId of createDto.branchIds) {
        const bpm = new BranchPartMasterEntity();
        bpm.id = uuidv4();
        bpm.partMasterId = partMaster.id;
        bpm.branchId = branchId;
        bpm.createdBy = user.id;
        bpm.createdAt = new Date();
        branchPartMasters.push(bpm);
      }

      if (branchPartMasters.length > 0) {
        await this.branchPartMasterRepo.save(branchPartMasters);
      }
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: partMaster.id,
      functionType: 'PartMaster',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới bộ phận master: ${partMaster.code} - ${partMaster.name}`,
      oldData: '{}',
      newData: JSON.stringify(partMaster),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới bộ phận master thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdatePartMasterDto) {
    const partMaster = await this.repo.findOne({
      where: { id: updateDto.id, isDeleted: false },
    });

    if (!partMaster) {
      throw new NotFoundException('Không tìm thấy bộ phận master');
    }

    if (updateDto.code && updateDto.code !== partMaster.code) {
      const existingCode = await this.repo.findOne({
        where: {
          code: updateDto.code,
          isDeleted: false,
          id: Not(updateDto.id),
        },
      });
      if (existingCode) {
        throw new BadRequestException('Mã bộ phận master đã tồn tại');
      }
    }

    const oldData = { ...partMaster };

    const partMasterUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.code) partMasterUpdateData.code = updateDto.code;
    if (updateDto.name) partMasterUpdateData.name = updateDto.name;
    if (updateDto.description !== undefined)
      partMasterUpdateData.description = updateDto.description;

    await this.repo.update(updateDto.id, partMasterUpdateData);

    if (updateDto.branchIds !== undefined) {
      await this.branchPartMasterRepo.delete({ partMasterId: updateDto.id });
      if (updateDto.branchIds.length > 0) {
        const newLinks: BranchPartMasterEntity[] = [];
        for (const branchId of updateDto.branchIds) {
          const bpm = new BranchPartMasterEntity();
          bpm.id = uuidv4();
          bpm.partMasterId = updateDto.id;
          bpm.branchId = branchId;
          bpm.createdBy = user.id;
          bpm.createdAt = new Date();
          newLinks.push(bpm);
        }
        await this.branchPartMasterRepo.save(newLinks);
      }
    }

    const newData = await this.repo.findOne({ where: { id: updateDto.id } });

    const actionLogDto: ActionLogCreateDto = {
      functionId: partMaster.id,
      functionType: 'PartMaster',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật bộ phận master: ${partMaster.code}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật bộ phận master thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const partMaster = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: { parts: true },
    });

    if (!partMaster) {
      throw new NotFoundException('Không tìm thấy bộ phận master');
    }

    if (partMaster.parts && (await partMaster.parts).length > 0) {
      throw new BadRequestException(
        'Không thể ngừng hoạt động bộ phận master đang có dữ liệu liên kết (bộ phận)',
      );
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'PartMaster',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động bộ phận master: ${partMaster.code} - ${partMaster.name}`,
      oldData: JSON.stringify(partMaster),
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động bộ phận master thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const partMaster = await this.repo.findOne({
      where: { id },
    });

    if (!partMaster) {
      throw new NotFoundException('Không tìm thấy bộ phận master');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'PartMaster',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt bộ phận master: ${partMaster.code}`,
      oldData: JSON.stringify(partMaster),
      newData: JSON.stringify({ ...partMaster, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt bộ phận master thành công',
    };
  }

  async findById(id: string) {
    const partMaster = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        parts: true,
        branchPartMasters: {
          branch: true,
        },
      },
    });

    if (!partMaster) {
      throw new NotFoundException('Không tìm thấy bộ phận master');
    }

    return {
      message: 'Lấy thông tin bộ phận master thành công',
      data: partMaster,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<PartMasterEntity> = {
      isDeleted: false,
    };

    if (data.where.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }
    if (data.where.name) {
      whereCon.name = ILike(`%${data.where.name}%`);
    }
    if ([true, false].includes(data.where.isDeleted)) {
      whereCon.isDeleted = data.where.isDeleted;
    }

    const [partMasters, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: partMasters,
      total,
    };
  }

  async selectBox() {
    const partMasters = await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true },
      order: { name: 'ASC' },
    });

    return partMasters;
  }
}
