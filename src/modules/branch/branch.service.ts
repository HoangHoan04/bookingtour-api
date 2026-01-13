import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { PaginationDto, UserDto } from 'src/dto';
import { BranchEntity, BranchPartMasterEntity } from 'src/entities/tour';
import {
  BranchPartMasterRepository,
  BranchRepository,
} from 'src/repositories/hr.repository';
import { enumData } from '../../constants';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreateBranchDto, UpdateBranchDto } from './dto';

@Injectable()
export class BranchService {
  constructor(
    private readonly repo: BranchRepository,
    private readonly actionLogService: ActionLogService,
    private readonly branchPartMasterRepo: BranchPartMasterRepository,
  ) {}

  async findById(id: string) {
    const branch = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        company: true,
        departments: true,
        parts: true,
        positions: true,
        employees: true,
        branchPartMasters: {
          partMaster: true,
        },
      },
    });

    if (!branch) {
      throw new NotFoundException('Không tìm thấy chi nhánh');
    }

    return {
      message: 'Tìm kiếm chi nhánh thành công',
      data: branch,
    };
  }

  async selectBox() {
    const branches = await this.repo.find({
      where: { isDeleted: false },
      select: {
        id: true,
        code: true,
        name: true,
        shortName: true,
      },
      order: { name: 'ASC' },
    });

    return branches;
  }

  async pagination(user: UserDto, data: PaginationDto) {
    const whereCon: FindOptionsWhere<BranchEntity> = {
      isDeleted: false,
    };

    if (data.where.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }
    if (data.where.name) {
      whereCon.name = ILike(`%${data.where.name}%`);
    }
    if (data.where.shortName) {
      whereCon.shortName = ILike(`%${data.where.shortName}%`);
    }
    if (data.where.address) {
      whereCon.address = ILike(`%${data.where.address}%`);
    }
    if (data.where.type) {
      whereCon.type = data.where.type;
    }
    if (data.where.companyId) {
      whereCon.companyId = data.where.companyId;
    }

    if (data.where.isHeadquarters !== undefined) {
      whereCon.isHeadquarters = data.where.isHeadquarters;
    }
    if ([true, false].includes(data.where.isDeleted)) {
      whereCon.isDeleted = data.where.isDeleted;
    }

    const [branches, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        company: true,
      },
    });

    return { data: branches, total };
  }

  async create(user: UserDto, createDto: CreateBranchDto) {
    const existingBranch = await this.repo.findOne({
      where: { code: createDto.code, isDeleted: false },
    });
    if (existingBranch) {
      throw new BadRequestException(
        `Mã chi nhánh "${createDto.code}" đã tồn tại`,
      );
    }

    if (createDto.companyId) {
      const company = await this.repo.manager.findOne('CompanyEntity', {
        where: { id: createDto.companyId, isDeleted: false },
      });
      if (!company) {
        throw new NotFoundException('Không tìm thấy công ty');
      }
    }

    const branch = new BranchEntity();
    branch.id = uuidv4();
    branch.code = createDto.code;
    branch.name = createDto.name;
    branch.shortName = createDto.shortName;
    branch.type = createDto.type;
    branch.isHeadquarters = createDto.isHeadquarters ?? false;
    branch.description = createDto.description;
    branch.address = createDto.address;
    branch.ipAddress = createDto.ipAddress;
    branch.phoneNumber = createDto.phoneNumber;
    branch.email = createDto.email;
    branch.companyId = createDto.companyId;
    branch.createdBy = user.id;
    branch.createdAt = new Date();
    branch.isDeleted = false;

    await this.repo.insert(branch);

    if (createDto.partMasterIds && createDto.partMasterIds.length > 0) {
      const branchPartMasters = createDto.partMasterIds.map((partMasterId) => {
        const bpm = new BranchPartMasterEntity();
        bpm.id = uuidv4();
        bpm.branchId = branch.id;
        bpm.partMasterId = partMasterId;
        bpm.createdBy = user.id;
        bpm.createdAt = new Date();
        bpm.isDeleted = false;
        return bpm;
      });
      await this.branchPartMasterRepo.insert(branchPartMasters);
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: branch.id,
      functionType: 'Branch',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới chi nhánh: ${branch.code} - ${branch.name}`,
      oldData: '{}',
      newData: JSON.stringify(createDto),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới chi nhánh thành công',
      data: { id: branch.id },
    };
  }

  async update(user: UserDto, updateDto: UpdateBranchDto) {
    const branch = await this.repo.findOne({
      where: { id: updateDto.id, isDeleted: false },
    });

    if (!branch) {
      throw new NotFoundException('Không tìm thấy chi nhánh cần cập nhật');
    }

    if (updateDto.code && updateDto.code !== branch.code) {
      const existingCode = await this.repo.findOne({
        where: { code: updateDto.code, isDeleted: false },
      });
      if (existingCode) {
        throw new BadRequestException(
          `Mã chi nhánh "${updateDto.code}" đã tồn tại`,
        );
      }
    }

    if (
      updateDto.companyId !== undefined &&
      updateDto.companyId !== branch.companyId
    ) {
      if (updateDto.companyId) {
        const company = await this.repo.manager.findOne('CompanyEntity', {
          where: { id: updateDto.companyId, isDeleted: false },
        });
        if (!company) {
          throw new NotFoundException('Không tìm thấy công ty');
        }
      }
    }

    const oldData = { ...branch };
    const updateData: Partial<BranchEntity> = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.code !== undefined) updateData.code = updateDto.code;
    if (updateDto.name !== undefined) updateData.name = updateDto.name;
    if (updateDto.shortName !== undefined)
      updateData.shortName = updateDto.shortName;
    if (updateDto.type !== undefined) updateData.type = updateDto.type;
    if (updateDto.isHeadquarters !== undefined)
      updateData.isHeadquarters = updateDto.isHeadquarters;
    if (updateDto.description !== undefined)
      updateData.description = updateDto.description;
    if (updateDto.address !== undefined) updateData.address = updateDto.address;
    if (updateDto.ipAddress !== undefined)
      updateData.ipAddress = updateDto.ipAddress;
    if (updateDto.phoneNumber !== undefined)
      updateData.phoneNumber = updateDto.phoneNumber;
    if (updateDto.email !== undefined) updateData.email = updateDto.email;
    if (updateDto.companyId !== undefined)
      updateData.companyId = updateDto.companyId;

    await this.repo.update(updateDto.id, updateData);

    if (updateDto.partMasterIds !== undefined) {
      await this.branchPartMasterRepo.delete({ branchId: updateDto.id });
      if (updateDto.partMasterIds.length > 0) {
        const newBpms = updateDto.partMasterIds.map((partMasterId) => {
          const bpm = new BranchPartMasterEntity();
          bpm.id = uuidv4();
          bpm.branchId = updateDto.id;
          bpm.partMasterId = partMasterId;
          bpm.createdBy = user.id;
          bpm.createdAt = new Date();
          bpm.isDeleted = false;
          return bpm;
        });
        await this.branchPartMasterRepo.insert(newBpms);
      }
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: branch.id,
      functionType: 'Branch',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật chi nhánh: ${branch.code} - ${branch.name}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(updateDto),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật chi nhánh thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const branch = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!branch) {
      throw new NotFoundException('Không tìm thấy chi nhánh');
    }

    const hasEmployees = await this.repo.manager.count('EmployeeEntity', {
      where: { branchId: id, isDeleted: false },
    });

    if (hasEmployees > 0) {
      throw new BadRequestException(
        'Không thể vô hiệu hóa chi nhánh đang có nhân viên',
      );
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Branch',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Vô hiệu hóa chi nhánh: ${branch.code} - ${branch.name}`,
      oldData: JSON.stringify({ isDeleted: false }),
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Vô hiệu hóa chi nhánh thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const branch = await this.repo.findOne({ where: { id } });

    if (!branch) {
      throw new NotFoundException('Không tìm thấy chi nhánh');
    }

    if (!branch.isDeleted) {
      throw new BadRequestException('Chi nhánh đã được kích hoạt');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Branch',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt chi nhánh: ${branch.code} - ${branch.name}`,
      oldData: JSON.stringify({ isDeleted: true }),
      newData: JSON.stringify({ isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt chi nhánh thành công',
    };
  }

  async findByCodes(codes: string[]) {
    if (!codes || codes.length === 0) {
      return [];
    }

    return await this.repo.find({
      where: {
        code: In(codes),
        isDeleted: false,
      },
      relations: {
        company: true,
      },
    });
  }

  async findByCompanyId(companyId: string) {
    return await this.repo.find({
      where: {
        companyId,
        isDeleted: false,
      },
      order: { name: 'ASC' },
    });
  }
}
