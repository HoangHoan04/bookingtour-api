import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { enumData } from 'src/constants';
import { PaginationDto, UserDto } from 'src/dto';
import { DepartmentEntity } from 'src/entities/tour';
import { DepartmentRepository } from 'src/repositories/hr.repository';
import { FindOptionsWhere, ILike, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';

@Injectable()
export class DepartmentService {
  constructor(
    private readonly repo: DepartmentRepository,
    private readonly actionLogService: ActionLogService,
  ) {}

  async create(user: UserDto, createDto: CreateDepartmentDto) {
    const existingCode = await this.repo.findOne({
      where: { code: createDto.code, isDeleted: false },
    });
    if (existingCode) {
      throw new BadRequestException('Mã phòng ban đã tồn tại');
    }
    const department = new DepartmentEntity();
    department.id = uuidv4();
    department.code = createDto.code;
    department.name = createDto.name;
    department.description = createDto.description;
    department.limit = createDto.limit;
    department.departmentTypeId = createDto.departmentTypeId;
    department.companyId = createDto.companyId;
    department.branchId = createDto.branchId;
    department.createdBy = user.id;
    department.createdAt = new Date();

    if (createDto.parentId) {
      const parent = await this.repo.findOne({
        where: { id: createDto.parentId, isDeleted: false },
      });
      if (!parent) {
        throw new BadRequestException('Phòng ban cha không tồn tại');
      }
      department.parentDepartment = Promise.resolve(parent);
    }

    await this.repo.save(department);

    const actionLogDto: ActionLogCreateDto = {
      functionId: department.id,
      functionType: 'Department',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới phòng ban: ${department.code} - ${department.name}`,
      oldData: '{}',
      newData: JSON.stringify(department),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới phòng ban thành công',
      data: department,
    };
  }

  async update(user: UserDto, updateDto: UpdateDepartmentDto) {
    const department = await this.repo.findOne({
      where: { id: updateDto.id, isDeleted: false },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy phòng ban');
    }

    if (updateDto.code && updateDto.code !== department.code) {
      const existingCode = await this.repo.findOne({
        where: {
          code: updateDto.code,
          isDeleted: false,
          id: Not(updateDto.id),
        },
      });
      if (existingCode) {
        throw new BadRequestException('Mã phòng ban đã tồn tại');
      }
    }

    const oldData = { ...department };
    department.code = updateDto.code;
    department.name = updateDto.name;
    department.limit = updateDto.limit;
    department.description = updateDto.description;
    department.departmentTypeId = updateDto.departmentTypeId;
    department.companyId = updateDto.companyId;
    department.branchId = updateDto.branchId;
    department.updatedBy = user.id;
    department.updatedAt = new Date();

    if (updateDto.parentId !== undefined) {
      if (updateDto.parentId === null) {
        (department as any).parentDepartment = undefined;
      } else {
        if (updateDto.parentId === department.id) {
          throw new BadRequestException(
            'Không thể chọn chính mình làm phòng ban cha',
          );
        }

        const checkIsDescendant = async (
          dept: DepartmentEntity,
          targetId: string,
        ): Promise<boolean> => {
          const children = await dept.childDepartments;
          if (!children || children.length === 0) return false;

          for (const child of children) {
            if (child.id === targetId) return true;
            if (await checkIsDescendant(child, targetId)) return true;
          }
          return false;
        };

        if (await checkIsDescendant(department, updateDto.parentId)) {
          throw new BadRequestException(
            'Không thể chọn phòng ban con làm phòng ban cha',
          );
        }

        const parent = await this.repo.findOne({
          where: { id: updateDto.parentId, isDeleted: false },
        });
        if (!parent) {
          throw new BadRequestException('Phòng ban cha không tồn tại');
        }
        department.parentDepartment = Promise.resolve(parent);
      }
    }

    await this.repo.save(department);

    const newData = await this.repo.findOne({ where: { id: updateDto.id } });

    const actionLogDto: ActionLogCreateDto = {
      functionId: department.id,
      functionType: 'Department',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật phòng ban: ${department.code}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật phòng ban thành công',
      data: newData,
    };
  }

  async deactivate(user: UserDto, id: string) {
    const department = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        childDepartments: true,
        parts: true,
        positions: true,
        employees: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy phòng ban');
    }

    const [parts, positions, employees] = await Promise.all([
      department.parts,
      department.positions,
      department.employees,
    ]);

    if (parts?.length > 0 || positions?.length > 0 || employees?.length > 0) {
      throw new BadRequestException(
        'Không thể ngừng hoạt động phòng ban đang có dữ liệu liên kết (Bộ phận/Chức vụ/Nhân viên)',
      );
    }

    const children = await department.childDepartments;
    if (children && children.length > 0) {
      throw new BadRequestException(
        'Không thể ngừng hoạt động phòng ban đang chứa phòng ban con',
      );
    }

    department.isDeleted = true;
    department.updatedBy = user.id;
    department.updatedAt = new Date();

    await this.repo.save(department);

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Department',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động phòng ban: ${department.code} - ${department.name}`,
      oldData: JSON.stringify(department),
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động phòng ban thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const department = await this.repo.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy phòng ban');
    }

    department.isDeleted = false;
    department.updatedBy = user.id;
    department.updatedAt = new Date();

    await this.repo.save(department);

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Department',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt phòng ban: ${department.code}`,
      oldData: JSON.stringify({ ...department, isDeleted: true }),
      newData: JSON.stringify({ ...department, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt phòng ban thành công',
    };
  }

  async findById(id: string) {
    const department = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        departmentType: true,
        parts: true,
        branch: true,
        employees: true,
        positions: true,
        company: true,
        parentDepartment: true,
        childDepartments: true,
      },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy phòng ban');
    }

    return {
      message: 'Lấy thông tin phòng ban thành công',
      data: department,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<DepartmentEntity> = {
      isDeleted: false,
    };

    if (data.where?.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }
    if (data.where?.name) {
      whereCon.name = ILike(`%${data.where.name}%`);
    }
    if (data.where?.companyId) {
      whereCon.companyId = data.where.companyId;
    }
    if (data.where?.branchId) {
      whereCon.branchId = data.where.branchId;
    }
    if (data.where?.departmentTypeId) {
      whereCon.departmentTypeId = data.where.departmentTypeId;
    }

    const [departments, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: {
        departmentType: true,
        branch: true,
        company: true,
        parentDepartment: true,
        childDepartments: true,
      },
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: departments,
      total,
    };
  }

  async selectBox() {
    const departments = await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true },
      order: { name: 'ASC' },
    });

    return departments;
  }

  async getTree() {
    const roots = await this.repo.find({
      where: {
        isDeleted: false,
      },
      relations: ['departmentType', 'branch', 'company'],
    });

    const rootDepartments: DepartmentEntity[] = [];
    for (const dept of roots) {
      const parent = await dept.parentDepartment;
      if (!parent) {
        rootDepartments.push(dept);
      }
    }

    const buildTree = async (department: DepartmentEntity): Promise<any> => {
      const children = await department.childDepartments;
      const childrenData: any[] = [];

      if (children && children.length > 0) {
        for (const child of children) {
          if (!child.isDeleted) {
            childrenData.push(await buildTree(child));
          }
        }
      }

      return {
        ...department,
        children: childrenData,
      };
    };

    const trees: any[] = [];
    for (const root of rootDepartments) {
      trees.push(await buildTree(root));
    }

    return {
      message: 'Lấy cây phòng ban thành công',
      data: trees,
    };
  }

  async getDescendants(id: string) {
    const department = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy phòng ban');
    }

    const getAllDescendants = async (
      dept: DepartmentEntity,
    ): Promise<DepartmentEntity[]> => {
      const children = await dept.childDepartments;
      let descendants: DepartmentEntity[] = [];

      if (children && children.length > 0) {
        for (const child of children) {
          if (!child.isDeleted) {
            descendants.push(child);
            const childDescendants = await getAllDescendants(child);
            descendants = descendants.concat(childDescendants);
          }
        }
      }

      return descendants;
    };

    const descendants = await getAllDescendants(department);

    return {
      message: 'Lấy danh sách phòng ban con thành công',
      data: descendants,
    };
  }

  async getAncestors(id: string) {
    const department = await this.repo.findOne({
      where: { id, isDeleted: false },
    });

    if (!department) {
      throw new NotFoundException('Không tìm thấy phòng ban');
    }

    const getAllAncestors = async (
      dept: DepartmentEntity,
    ): Promise<DepartmentEntity[]> => {
      const parent = await dept.parentDepartment;
      const ancestors: DepartmentEntity[] = [];

      if (parent && !parent.isDeleted) {
        ancestors.push(parent);
        const parentAncestors = await getAllAncestors(parent);
        ancestors.push(...parentAncestors);
      }

      return ancestors;
    };

    const ancestors = await getAllAncestors(department);

    return {
      message: 'Lấy danh sách phòng ban cha thành công',
      data: ancestors,
    };
  }

  async getRoots() {
    const allDepartments = await this.repo.find({
      where: { isDeleted: false },
      relations: {
        departmentType: true,
        company: true,
        branch: true,
        parentDepartment: true,
      },
      order: { name: 'ASC' },
    });

    const roots: DepartmentEntity[] = [];
    for (const dept of allDepartments) {
      const parent = await dept.parentDepartment;
      if (!parent) {
        roots.push(dept);
      }
    }

    return {
      message: 'Lấy danh sách phòng ban gốc thành công',
      data: roots,
    };
  }
}
