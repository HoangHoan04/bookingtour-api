import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto, UserDto } from 'src/dto';
import { PositionEntity } from 'src/entities/tour';
import { PositionRepository } from 'src/repositories/hr.repository';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { enumData } from '../../constants';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreatePositionDto, UpdatePositionDto } from './dto';

@Injectable()
export class PositionService {
  constructor(
    private readonly repo: PositionRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async create(user: UserDto, createDto: CreatePositionDto) {
    const existingCode = await this.repo.findOne({
      where: { code: createDto.code, isDeleted: false },
    });
    if (existingCode) {
      throw new BadRequestException('Mã vị trí đã tồn tại');
    }

    const position = new PositionEntity();
    position.id = uuidv4();
    position.code = createDto.code;
    position.name = createDto.name;
    position.description = createDto.description;
    position.companyId = createDto.companyId;
    position.departmentId = createDto.departmentId;
    position.branchId = createDto.branchId;
    position.partId = createDto.partId;
    position.isLimitHoursWorking = createDto.isLimitHoursWorking;
    position.limit = createDto.limit;
    position.workingHour = createDto.workingHour;
    position.isTimeKeeping = createDto.isTimeKeeping;
    position.hourWorkingStart = createDto.hourWorkingStart;
    position.hourWorkingEnd = createDto.hourWorkingEnd;
    position.hourSnapShotStart = createDto.hourSnapShotStart;
    position.hourSnapShotEnd = createDto.hourSnapShotEnd;
    position.minimumWorkingHour = createDto.minimumWorkingHour;
    position.isSwapPosition = createDto.isSwapPosition;
    position.targetChangePositionId = createDto.targetChangePositionId;
    position.isApprovedWhenHiringCandidate =
      createDto.isApprovedWhenHiringCandidate;
    position.content = createDto.content;
    position.positionMasterId = createDto.positionMasterId;
    position.createdBy = user.id;
    position.createdAt = new Date();

    await this.repo.insert(position);

    const actionLogDto: ActionLogCreateDto = {
      functionId: position.id,
      functionType: 'Position',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới vị trí: ${position.code} - ${position.name}`,
      oldData: '{}',
      newData: JSON.stringify(position),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới vị trí thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdatePositionDto) {
    const position = await this.repo.findOne({
      where: { id: updateDto.id, isDeleted: false },
    });

    if (!position) {
      throw new NotFoundException('Không tìm thấy vị trí');
    }

    if (updateDto.code && updateDto.code !== position.code) {
      const existingCode = await this.repo.findOne({
        where: { code: updateDto.code, isDeleted: false },
      });
      if (existingCode) {
        throw new BadRequestException('Mã vị trí đã tồn tại');
      }
    }

    const oldData = { ...position };
    const positionUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.code) positionUpdateData.code = updateDto.code;
    if (updateDto.name) positionUpdateData.name = updateDto.name;
    positionUpdateData.description = updateDto.description;
    if (updateDto.companyId !== undefined)
      positionUpdateData.companyId = updateDto.companyId;
    if (updateDto.departmentId !== undefined)
      positionUpdateData.departmentId = updateDto.departmentId;
    if (updateDto.branchId !== undefined)
      positionUpdateData.branchId = updateDto.branchId;
    if (updateDto.partId !== undefined)
      positionUpdateData.partId = updateDto.partId;
    if (updateDto.isLimitHoursWorking !== undefined)
      positionUpdateData.isLimitHoursWorking = updateDto.isLimitHoursWorking;
    if (updateDto.limit !== undefined)
      positionUpdateData.limit = updateDto.limit;
    if (updateDto.workingHour !== undefined)
      positionUpdateData.workingHour = updateDto.workingHour;
    if (updateDto.isTimeKeeping !== undefined)
      positionUpdateData.isTimeKeeping = updateDto.isTimeKeeping;
    if (updateDto.hourWorkingStart !== undefined)
      positionUpdateData.hourWorkingStart = updateDto.hourWorkingStart;
    if (updateDto.hourWorkingEnd !== undefined)
      positionUpdateData.hourWorkingEnd = updateDto.hourWorkingEnd;
    if (updateDto.hourSnapShotStart !== undefined)
      positionUpdateData.hourSnapShotStart = updateDto.hourSnapShotStart;
    if (updateDto.hourSnapShotEnd !== undefined)
      positionUpdateData.hourSnapShotEnd = updateDto.hourSnapShotEnd;
    if (updateDto.minimumWorkingHour !== undefined)
      positionUpdateData.minimumWorkingHour = updateDto.minimumWorkingHour;
    if (updateDto.isSwapPosition !== undefined)
      positionUpdateData.isSwapPosition = updateDto.isSwapPosition;
    if (updateDto.targetChangePositionId !== undefined)
      positionUpdateData.targetChangePositionId =
        updateDto.targetChangePositionId;
    if (updateDto.isApprovedWhenHiringCandidate !== undefined)
      positionUpdateData.isApprovedWhenHiringCandidate =
        updateDto.isApprovedWhenHiringCandidate;
    if (updateDto.content !== undefined)
      positionUpdateData.content = updateDto.content;
    if (updateDto.positionMasterId !== undefined)
      positionUpdateData.positionMasterId = updateDto.positionMasterId;

    await this.repo.update(updateDto.id, positionUpdateData);

    const newData = await this.repo.findOne({ where: { id: updateDto.id } });

    const actionLogDto: ActionLogCreateDto = {
      functionId: position.id,
      functionType: 'Position',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật vị trí: ${position.code}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật vị trí thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const position = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!position) {
      throw new NotFoundException('Không tìm thấy vị trí');
    }

    if (position.employees && (await position.employees).length > 0) {
      throw new BadRequestException(
        'Vị trí đang có nhân viên sử dụng, không thể ngừng hoạt động',
      );
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Position',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động vị trí: ${position.code} - ${position.name}`,
      oldData: JSON.stringify(position),
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động vị trí thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const position = await this.repo.findOne({
      where: { id },
    });

    if (!position) {
      throw new NotFoundException('Không tìm thấy vị trí  ');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Position',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt vị trí: ${position.code}`,
      oldData: JSON.stringify(position),
      newData: JSON.stringify({ ...position, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt vị trí thành công',
    };
  }

  async findById(id: string) {
    const position = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        employees: true,
      },
    });

    if (!position) {
      throw new NotFoundException('Không tìm thấy vị trí');
    }

    return {
      message: 'Lấy thông tin vị trí thành công',
      data: position,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<PositionEntity> = {
      isDeleted: false,
    };

    if (data.where.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }
    if (data.where.name) {
      whereCon.name = ILike(`%${data.where.name}%`);
    }

    const [positions, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: positions,
      total,
    };
  }

  async selectBox() {
    const positions = await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true },
      order: { name: 'ASC' },
    });

    return positions;
  }
}
