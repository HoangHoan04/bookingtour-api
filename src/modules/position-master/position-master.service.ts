import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto, UserDto } from 'src/dto';
import { PositionMasterEntity } from 'src/entities/tour';
import { PositionMasterRepository } from 'src/repositories/hr.repository';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { enumData } from '../../constants';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreatePositionMasterDto, UpdatePositionMasterDto } from './dto';

@Injectable()
export class PositionMasterService {
  constructor(
    private readonly repo: PositionMasterRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async create(user: UserDto, createDto: CreatePositionMasterDto) {
    const existingCode = await this.repo.findOne({
      where: { code: createDto.code, isDeleted: false },
    });
    if (existingCode) {
      throw new BadRequestException('Mã vị trí master đã tồn tại');
    }

    const positionMaster = new PositionMasterEntity();
    positionMaster.id = uuidv4();
    positionMaster.code = createDto.code;
    positionMaster.name = createDto.name;
    positionMaster.description = createDto.description;
    positionMaster.isLimitHoursWorking = createDto.isLimitHoursWorking;
    positionMaster.limit = createDto.limit;
    positionMaster.workingHour = createDto.workingHour;
    positionMaster.isTimeKeeping = createDto.isTimeKeeping;
    positionMaster.hourWorkingStart = createDto.hourWorkingStart;
    positionMaster.hourWorkingEnd = createDto.hourWorkingEnd;
    positionMaster.hourSnapShotStart = createDto.hourSnapShotStart;
    positionMaster.hourSnapShotEnd = createDto.hourSnapShotEnd;
    positionMaster.minimumWorkingHour = createDto.minimumWorkingHour;
    positionMaster.isSwapPosition = createDto.isSwapPosition;
    positionMaster.targetChangePositionId = createDto.targetChangePositionId;
    positionMaster.isApprovedWhenHiringCandidate =
      createDto.isApprovedWhenHiringCandidate;
    positionMaster.isHadASecondInterview = createDto.isHadASecondInterview;
    positionMaster.isApprovedDayOff = createDto.isApprovedDayOff;
    positionMaster.createdBy = user.id;
    positionMaster.createdAt = new Date();

    await this.repo.insert(positionMaster);

    const actionLogDto: ActionLogCreateDto = {
      functionId: positionMaster.id,
      functionType: 'PositionMaster',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới vị trí master: ${positionMaster.code} - ${positionMaster.name}`,
      oldData: '{}',
      newData: JSON.stringify(positionMaster),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới vị trí master thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdatePositionMasterDto) {
    const positionMaster = await this.repo.findOne({
      where: { id: updateDto.id, isDeleted: false },
    });

    if (!positionMaster) {
      throw new NotFoundException('Không tìm thấy vị trí master');
    }

    if (updateDto.code && updateDto.code !== positionMaster.code) {
      const existingCode = await this.repo.findOne({
        where: { code: updateDto.code, isDeleted: false },
      });
      if (existingCode) {
        throw new BadRequestException('Mã vị trí master đã tồn tại');
      }
    }

    const oldData = { ...positionMaster };
    const positionMasterUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.code) positionMasterUpdateData.code = updateDto.code;
    if (updateDto.name) positionMasterUpdateData.name = updateDto.name;
    positionMasterUpdateData.description = updateDto.description;
    if (updateDto.isLimitHoursWorking !== undefined)
      positionMasterUpdateData.isLimitHoursWorking =
        updateDto.isLimitHoursWorking;
    if (updateDto.limit !== undefined)
      positionMasterUpdateData.limit = updateDto.limit;
    if (updateDto.workingHour !== undefined)
      positionMasterUpdateData.workingHour = updateDto.workingHour;
    if (updateDto.isTimeKeeping !== undefined)
      positionMasterUpdateData.isTimeKeeping = updateDto.isTimeKeeping;
    if (updateDto.hourWorkingStart !== undefined)
      positionMasterUpdateData.hourWorkingStart = updateDto.hourWorkingStart;
    if (updateDto.hourWorkingEnd !== undefined)
      positionMasterUpdateData.hourWorkingEnd = updateDto.hourWorkingEnd;
    if (updateDto.hourSnapShotStart !== undefined)
      positionMasterUpdateData.hourSnapShotStart = updateDto.hourSnapShotStart;
    if (updateDto.hourSnapShotEnd !== undefined)
      positionMasterUpdateData.hourSnapShotEnd = updateDto.hourSnapShotEnd;
    if (updateDto.minimumWorkingHour !== undefined)
      positionMasterUpdateData.minimumWorkingHour =
        updateDto.minimumWorkingHour;
    if (updateDto.isSwapPosition !== undefined)
      positionMasterUpdateData.isSwapPosition = updateDto.isSwapPosition;
    if (updateDto.targetChangePositionId !== undefined)
      positionMasterUpdateData.targetChangePositionId =
        updateDto.targetChangePositionId;
    if (updateDto.isApprovedWhenHiringCandidate !== undefined)
      positionMasterUpdateData.isApprovedWhenHiringCandidate =
        updateDto.isApprovedWhenHiringCandidate;

    if (updateDto.isHadASecondInterview !== undefined)
      positionMasterUpdateData.isHadASecondInterview =
        updateDto.isHadASecondInterview;
    if (updateDto.isApprovedDayOff !== undefined)
      positionMasterUpdateData.isApprovedDayOff = updateDto.isApprovedDayOff;

    await this.repo.update(updateDto.id, positionMasterUpdateData);

    const newData = await this.repo.findOne({ where: { id: updateDto.id } });

    const actionLogDto: ActionLogCreateDto = {
      functionId: positionMaster.id,
      functionType: 'PositionMaster',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật vị trí master: ${positionMaster.code}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật vị trí master thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const positionMaster = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!positionMaster) {
      throw new NotFoundException('Không tìm thấy vị trí master');
    }

    if (
      (positionMaster.employees &&
        (await positionMaster.employees).length > 0) ||
      (positionMaster.positions && (await positionMaster.positions).length > 0)
    ) {
      throw new BadRequestException(
        'Vị trí master đang có nhân viên sử dụng, không thể ngừng hoạt động',
      );
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'PositionMaster',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động vị trí master: ${positionMaster.code} - ${positionMaster.name}`,
      oldData: JSON.stringify(positionMaster),
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động vị trí master thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const positionMaster = await this.repo.findOne({
      where: { id },
    });

    if (!positionMaster) {
      throw new NotFoundException(' Không tìm thấy vị trí master  ');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'PositionMaster',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt vị trí master: ${positionMaster.code}`,
      oldData: JSON.stringify(positionMaster),
      newData: JSON.stringify({ ...positionMaster, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt vị trí master thành công',
    };
  }

  async findById(id: string) {
    const positionMaster = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        employees: true,
      },
    });

    if (!positionMaster) {
      throw new NotFoundException('Không tìm thấy vị trí master');
    }

    return {
      message: 'Lấy thông tin vị trí master thành công',
      data: positionMaster,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<PositionMasterEntity> = {
      isDeleted: false,
    };

    if (data.where.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }
    if (data.where.name) {
      whereCon.name = ILike(`%${data.where.name}%`);
    }

    const [positionMasters, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: positionMasters,
      total,
    };
  }

  async selectBox() {
    const positionMasters = await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true },
      order: { name: 'ASC' },
    });

    return positionMasters;
  }
}
