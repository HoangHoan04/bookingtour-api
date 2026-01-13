import { Injectable } from '@nestjs/common';
import { ActionLogEntity } from 'src/entities';
import { ActionLogRepository } from 'src/repositories/base.repository';
import { FindOptionsWhere } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PaginationDto } from '../../dto';
import { ActionLogCreateDto } from './dto';

@Injectable()
export class ActionLogService {
  constructor(private repo: ActionLogRepository) {}

  async create(dto: ActionLogCreateDto): Promise<void> {
    const actionLog = new ActionLogEntity();
    actionLog.id = uuidv4();
    actionLog.functionId = dto.functionId;
    actionLog.functionType = dto.functionType;
    actionLog.type = dto.type;
    actionLog.createdBy = dto.createdBy;
    actionLog.createdByName = dto.createdByName;
    actionLog.description = dto.description;
    actionLog.createdById = dto.createdById || '';
    actionLog.dataOld = JSON.parse(dto.oldData || '{}');
    actionLog.dataNew = JSON.parse(dto.newData || '{}');
    await this.repo.insert(actionLog);
  }

  async createList(dto: ActionLogCreateDto[]): Promise<void> {
    const lstInsert: ActionLogEntity[] = [];
    for (const item of dto) {
      const actionLog = new ActionLogEntity();
      actionLog.id = uuidv4();
      actionLog.functionId = item.functionId;
      actionLog.functionType = item.functionType;
      actionLog.type = item.type;
      actionLog.createdBy = item.createdBy;
      actionLog.createdByName = item.createdByName;
      actionLog.description = item.description;
      actionLog.createdById = item.createdById || '';
      actionLog.dataOld = JSON.parse(item?.oldData || '{}');
      actionLog.dataNew = JSON.parse(item?.newData || '{}');
      lstInsert.push(actionLog);
    }
    await this.repo.insert(lstInsert);
  }

  async pagination(data: PaginationDto) {
    const { skip = 0, take = 10, where } = data;
    const whereCon: FindOptionsWhere<ActionLogEntity> = {
      functionType: where.functionType,
      functionId: where.functionId,
    };
    if (where.createdBy) {
      whereCon.createdBy = where.createdBy;
    }
    if (where.type) {
      whereCon.type = where.type;
    }
    const res: any = await this.repo.findAndCount({
      where: data.where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: res[0],
      total: res[1],
    };
  }
}
