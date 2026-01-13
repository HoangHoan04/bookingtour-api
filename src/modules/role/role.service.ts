import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto, UserDto } from 'src/dto';
import { RoleEntity } from 'src/entities';
import {
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
  UserRoleRepository,
} from 'src/repositories';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { enumData } from '../../constants';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { AssignPermissionDto, CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly repo: RoleRepository,
    private readonly rolePermRepo: RolePermissionRepository,
    private readonly permRepo: PermissionRepository,
    private readonly actionLogService: ActionLogService,
    private readonly userRoleRepo: UserRoleRepository,
  ) {}

  async findAll() {
    return await this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    const rolePerms = await this.rolePermRepo.find({
      where: { roleId: id },
      relations: {
        permission: true,
      },
    });

    const result = {
      ...role,
      permissionIds: rolePerms.map((rp) => rp.permissionId),
      permissions: rolePerms.map((rp) => rp.permission),
    };

    return {
      message: 'Lấy thông tin vai trò thành công',
      data: result,
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
    role.isSystem = false;
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
    if (role.isSystem)
      throw new BadRequestException('Không thể chỉnh sửa vai trò hệ thống');
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
    if (role.isSystem)
      throw new BadRequestException(
        'Không thể thay đổi quyền của vai trò hệ thống',
      );

    const oldPermissions = await this.rolePermRepo.find({
      where: { roleId: data.roleId },
    });
    const oldPermissionIds = oldPermissions.map((p) => p.permissionId);

    await this.rolePermRepo.delete({ roleId: data.roleId });

    if (data.permissionIds && data.permissionIds.length > 0) {
      const rolePerms = data.permissionIds.map((permId) => {
        return this.rolePermRepo.create({
          roleId: data.roleId,
          permissionId: permId,
          scope: enumData.DataScope.OWN.code,
          createdAt: new Date(),
          createdBy: user.id,
        });
      });
      await this.rolePermRepo.save(rolePerms);
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: data.roleId,
      functionType: 'Permission',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: JSON.stringify({ permissionIds: oldPermissionIds }),
      newData: JSON.stringify({ permissionIds: data.permissionIds }),
      description: `Cập nhật quyền hạn cho vai trò: ${role.code}`,
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Phân quyền thành công' };
  }

  async delete(user: UserDto, id: string) {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Vai trò không tồn tại');
    if (role.isSystem)
      throw new BadRequestException('Không được xóa vai trò hệ thống');

    await this.repo.delete(id);

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Role',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      oldData: '{}',
      newData: '{}',
      description: `Xóa vai trò với ID: ${id}`,
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Xóa vai trò thành công' };
  }

  async pagination(user: UserDto, data: PaginationDto) {
    const whereCon: FindOptionsWhere<RoleEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if (data.where.isSystem !== undefined)
      whereCon.isSystem = data.where.isSystem;
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
      where: { isDeleted: false },
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
          employee: {
            position: true,
            avatar: true,
          },
        },
      },
    });

    const employees = userRoles
      .map((ur) => ur.user?.employee)
      .filter((emp) => emp !== null);

    return {
      message: 'Lấy danh sách nhân viên theo vai trò thành công',
      data: employees,
    };
  }
}
