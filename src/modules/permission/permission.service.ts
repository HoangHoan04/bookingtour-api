import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto } from 'src/dto';
import { UserDto } from 'src/dto/user.dto';
import { PermissionEntity } from 'src/entities';
import { PermissionRepository } from 'src/repositories';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from './dto/createPermission.dto';
import { PermissionGroup } from './dto/permissionGroup.dto';
import { enumData } from '../../constants';
import { ActionLogCreateDto } from '../actionLog/dto';

@Injectable()
export class PermissionService {
  constructor(
    private readonly repo: PermissionRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async findAllGrouped() {
    const permissions = await this.repo.find({
      order: { module: 'ASC', code: 'ASC' },
    });

    const grouped = permissions.reduce<PermissionGroup[]>((acc, curr) => {
      const group = acc.find((g) => g.module === curr.module);
      if (group) {
        group.items.push(curr);
      } else {
        acc.push({ module: curr.module, items: [curr] });
      }
      return acc;
    }, []);

    return { data: grouped };
  }

  async create(user: UserDto, createDto: CreatePermissionDto) {
    const existPermission = await this.repo.findOne({
      where: { code: createDto.code },
    });
    if (existPermission) throw new BadRequestException('Mã quyền đã tồn tại');

    const permission = new PermissionEntity();
    permission.id = uuidv4();
    permission.name = createDto.name;
    permission.code = createDto.code;
    permission.module = createDto.module;
    permission.description = createDto.description;
    permission.createdBy = user.id;
    permission.createdAt = new Date();

    await this.repo.save(permission);

    const actionLogDto: ActionLogCreateDto = {
      functionId: permission.id,
      functionType: 'Permission',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: '{}',
      newData: JSON.stringify(permission),
      description: `Tạo mới quyền: ${permission.code} - ${permission.name}`,
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Tạo quyền thành công' };
  }

  async update(user: UserDto, updateDto: UpdatePermissionDto) {
    const item = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!item) throw new BadRequestException('Không tìm thấy quyền');

    if (updateDto.code !== item.code) {
      const exist = await this.repo.findOne({
        where: { code: updateDto.code },
      });
      if (exist) throw new BadRequestException('Mã quyền mới đã tồn tại');
    }

    const oldPermissionData = JSON.stringify(item);

    const permissionUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.name) permissionUpdateData.name = updateDto.name;
    if (updateDto.code) permissionUpdateData.code = updateDto.code;
    if (updateDto.module) permissionUpdateData.module = updateDto.module;
    if (updateDto.description !== undefined)
      permissionUpdateData.description = updateDto.description;
    permissionUpdateData.updatedAt = new Date();
    permissionUpdateData.updatedBy = user.id;

    await this.repo.update(updateDto.id, permissionUpdateData);

    const actionLogDto: ActionLogCreateDto = {
      functionId: updateDto.id,
      functionType: 'Permission',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: oldPermissionData,
      newData: JSON.stringify({ ...item, ...permissionUpdateData }),
      description: `Cập nhật quyền: ${item.code} - ${item.name}`,
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Cập nhật thành công' };
  }

  async delete(user: UserDto, id: string) {
    await this.repo.delete(id);

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Permission',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: '{}',
      newData: '{}',
      description: `Xóa quyền với ID: ${id}`,
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Xóa thành công' };
  }

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy quyền');
    }

    return {
      message: 'Tìm kiếm quyền thành công',
      data: result,
    };
  }

  async pagination(user: UserDto, data: PaginationDto) {
    const whereCon: FindOptionsWhere<PermissionEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if (data.where.module) whereCon.module = ILike(`%${data.where.module}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;
    const [permissions, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        rolePermissions: true,
      },
    });
    return { data: permissions, total };
  }
}
