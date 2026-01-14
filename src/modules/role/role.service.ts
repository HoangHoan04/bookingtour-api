import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { enumData } from 'src/common/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { RoleEntity } from 'src/entities';
import { RoleRepository, UserRoleRepository } from 'src/repositories';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { AssignPermissionDto, CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly repo: RoleRepository,
    private readonly actionLogService: ActionLogService,
    private readonly userRoleRepo: UserRoleRepository,
  ) {}

  async findAll() {
    return await this.repo.find({
      where: { isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    return {
      message: 'Lấy thông tin vai trò thành công',
      data: {
        ...role,
        permissions: role.permissions || [],
      },
    };
  }

  async create(user: UserDto, data: CreateRoleDto) {
    const existRole = await this.repo.findOne({
      where: [{ code: data.code }, { name: data.name }],
    });
    if (existRole)
      throw new BadRequestException('Mã hoặc tên vai trò đã tồn tại');

    const role = new RoleEntity();
    role.id = uuidv4();
    role.name = data.name;
    role.code = data.code;
    role.description = data.description;
    role.permissions = [];
    role.isActive = true;
    role.createdBy = user.id;
    role.createdAt = new Date();

    const savedRole = await this.repo.save(role);

    const actionLogDto: ActionLogCreateDto = {
      functionId: role.id,
      functionType: 'Role',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: '{}',
      newData: JSON.stringify(role),
      description: `Tạo mới vai trò: ${role.code} - ${role.name}`,
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo vai trò thành công',
      data: savedRole,
    };
  }

  async update(user: UserDto, updateDto: UpdateRoleDto) {
    const role = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    if (role.code !== updateDto.code || role.name !== updateDto.name) {
      const exist = await this.repo.findOne({
        where: [{ code: updateDto.code }, { name: updateDto.name }],
      });
      if (exist && exist.id !== role.id)
        throw new BadRequestException('Mã hoặc tên vai trò đã tồn tại');
    }

    const oldRoleData = JSON.stringify(role);

    await this.repo.update(updateDto.id, {
      name: updateDto.name,
      code: updateDto.code,
      description: updateDto.description,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const newRole = await this.repo.findOne({ where: { id: updateDto.id } });

    const actionLogDto: ActionLogCreateDto = {
      functionId: updateDto.id,
      functionType: 'Role',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: oldRoleData,
      newData: JSON.stringify(newRole),
      description: `Cập nhật thông tin vai trò: ${role.code}`,
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Cập nhật vai trò thành công' };
  }

  async assignPermissions(user: UserDto, data: AssignPermissionDto) {
    const role = await this.repo.findOne({ where: { id: data.roleId } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    const oldPermissions = role.permissions || [];

    await this.repo.update(data.roleId, {
      permissions: data.permissionIds || [],
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: data.roleId,
      functionType: 'Permission',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: JSON.stringify({ permissions: oldPermissions }),
      newData: JSON.stringify({ permissions: data.permissionIds }),
      description: `Cập nhật quyền hạn cho vai trò: ${role.code}`,
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Phân quyền thành công' };
  }

  async delete(user: UserDto, id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Vai trò không tồn tại');

    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Role',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: JSON.stringify(role),
      newData: '{}',
      description: `Xóa vai trò: ${role.code}`,
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Xóa vai trò thành công' };
  }

  async pagination(user: UserDto, data: PaginationDto) {
    const whereCon: FindOptionsWhere<RoleEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [roles, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        userRoles: true,
      },
    });
    return { data: roles, total };
  }

  async selectBox() {
    const res: any[] = await this.repo.find({
      where: { isDeleted: false, isActive: true },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    return res;
  }

  async findEmployeesByRoleId(roleId: string) {
    const userRoles = await this.userRoleRepo.find({
      where: { roleId },
      relations: {
        user: {
          customer: true,
        },
      },
    });

    const users = userRoles
      .map((ur) => ({
        ...ur.user,
        customer: ur.user?.customer,
      }))
      .filter((user) => user !== null);

    return {
      message: 'Lấy danh sách người dùng theo vai trò thành công',
      data: users,
    };
  }
}
