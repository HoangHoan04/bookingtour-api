import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationDto, UserDto } from 'src/dto';
import { CompanyEntity } from 'src/entities/tour';
import { transformKeys } from 'src/helpers';
import { UploadFileRepository } from 'src/repositories';
import { CompanyRepository } from 'src/repositories/hr.repository';
import { FindOptionsWhere, ILike } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { enumData } from '../../constants';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { FileArchivalCreateDto } from '../fileArchival/dto';
import { FileArchivalService } from '../fileArchival/fileArchival.service';
import { CreateCompanyDto, ImportCompanyDto, UpdateCompanyDto } from './dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly repo: CompanyRepository,
    private readonly actionLogService: ActionLogService,
    private readonly fileArchivalService: FileArchivalService,
    private readonly fileArchivalRepo: UploadFileRepository,
  ) {}

  async create(user: UserDto, createDto: CreateCompanyDto) {
    const existingCode = await this.repo.findOne({
      where: { code: createDto.code, isDeleted: false },
    });
    if (existingCode) {
      throw new BadRequestException('Mã công ty đã tồn tại');
    }
    if (createDto.parentCompanyId) {
      const parentCompany = await this.repo.findOne({
        where: { id: createDto.parentCompanyId, isDeleted: false },
      });
      if (!parentCompany) {
        throw new NotFoundException('Không tìm thấy công ty cha');
      }
    }

    const company = new CompanyEntity();
    company.id = uuidv4();
    company.code = createDto.code;
    company.name = createDto.name;
    company.description = createDto.description;
    company.address = createDto.address;
    company.taxCode = createDto.taxCode;
    company.phoneNumber = createDto.phoneNumber;
    company.email = createDto.email;
    company.website = createDto.website;
    company.foundedDate = createDto.foundedDate;
    company.legalRepresentative = createDto.legalRepresentative;
    company.parentCompanyId = createDto.parentCompanyId;
    company.createdBy = user.id;
    company.createdAt = new Date();

    await this.repo.insert(company);

    const logoInput = Array.isArray(createDto.logoUrl)
      ? createDto.logoUrl[0]
      : createDto.logoUrl;
    if (logoInput?.fileUrl && logoInput?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: logoInput.fileUrl,
        fileName: logoInput.fileName,
        fileType: 'CompanyLogo',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'logoCompanyId',
        fileRelationId: company.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    if (createDto.documents) {
      const documentList = Array.isArray(createDto.documents)
        ? createDto.documents
        : [createDto.documents];

      for (const doc of documentList) {
        if (doc?.fileUrl && doc?.fileName) {
          const fileArchival: FileArchivalCreateDto = {
            fileUrl: doc.fileUrl,
            fileName: doc.fileName,
            fileType: 'CompanyDocument',
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            fileRelationName: 'documentCompanyId',
            fileRelationId: company.id,
          };
          await this.fileArchivalService.create(fileArchival);
        }
      }
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: company.id,
      functionType: 'Company',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới công ty: ${company.code} - ${company.name}`,
      oldData: '{}',
      newData: JSON.stringify(company),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới công ty thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdateCompanyDto) {
    const company = await this.repo.findOne({
      where: { id: updateDto.id, isDeleted: false },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    if (updateDto.code && updateDto.code !== company.code) {
      const existingCode = await this.repo.findOne({
        where: { code: updateDto.code, isDeleted: false },
      });
      if (existingCode) {
        throw new BadRequestException('Mã công ty đã tồn tại');
      }
    }

    if (updateDto.parentCompanyId) {
      if (updateDto.parentCompanyId === updateDto.id) {
        throw new BadRequestException(
          'Công ty không thể là công ty cha của chính nó',
        );
      }
      const parentCompany = await this.repo.findOne({
        where: { id: updateDto.parentCompanyId, isDeleted: false },
      });
      if (!parentCompany) {
        throw new NotFoundException('Không tìm thấy công ty cha');
      }
    }

    const oldData = { ...company };
    const companyUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.code !== undefined) companyUpdateData.code = updateDto.code;
    if (updateDto.name !== undefined) companyUpdateData.name = updateDto.name;
    if (updateDto.address !== undefined)
      companyUpdateData.address = updateDto.address;
    if (updateDto.taxCode !== undefined)
      companyUpdateData.taxCode = updateDto.taxCode;
    if (updateDto.phoneNumber !== undefined)
      companyUpdateData.phoneNumber = updateDto.phoneNumber;
    if (updateDto.email !== undefined)
      companyUpdateData.email = updateDto.email;
    if (updateDto.website !== undefined)
      companyUpdateData.website = updateDto.website;
    if (updateDto.description !== undefined)
      companyUpdateData.description = updateDto.description;
    if (updateDto.foundedDate !== undefined)
      companyUpdateData.foundedDate = updateDto.foundedDate;
    if (updateDto.legalRepresentative !== undefined)
      companyUpdateData.legalRepresentative = updateDto.legalRepresentative;
    if (updateDto.parentCompanyId !== undefined)
      companyUpdateData.parentCompanyId = updateDto.parentCompanyId;

    if (Object.prototype.hasOwnProperty.call(updateDto, 'logoUrl')) {
      await this.fileArchivalRepo.delete({ logoCompanyId: updateDto.id });

      const logoInput = Array.isArray(updateDto.logoUrl)
        ? updateDto.logoUrl[0]
        : updateDto.logoUrl;

      if (logoInput?.fileUrl && logoInput?.fileName) {
        const fileArchival = new FileArchivalCreateDto();
        fileArchival.createdBy = user.id;
        fileArchival.fileUrl = logoInput.fileUrl;
        fileArchival.fileName = logoInput.fileName;
        fileArchival.fileType = 'CompanyLogo';
        fileArchival.fileRelationName = 'logoCompanyId';
        fileArchival.fileRelationId = company.id;

        await this.fileArchivalService.create(fileArchival);
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateDto, 'documents')) {
      await this.fileArchivalRepo.delete({ documentCompanyId: updateDto.id });

      const documentList = Array.isArray(updateDto.documents)
        ? updateDto.documents
        : [updateDto.documents];

      for (const doc of documentList) {
        if (doc?.fileUrl && doc?.fileName) {
          const fileArchival = new FileArchivalCreateDto();
          fileArchival.createdBy = user.id;
          fileArchival.fileUrl = doc.fileUrl;
          fileArchival.fileName = doc.fileName;
          fileArchival.fileType = 'CompanyDocument';
          fileArchival.fileRelationName = 'documentCompanyId';
          fileArchival.fileRelationId = company.id;

          await this.fileArchivalService.create(fileArchival);
        }
      }
    }

    await this.repo.update(updateDto.id, companyUpdateData);

    const newData = await this.repo.findOne({ where: { id: updateDto.id } });
    const actionLogDto: ActionLogCreateDto = {
      functionId: company.id,
      functionType: 'Company',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật công ty: ${company.code}`,
      oldData: JSON.stringify(oldData),
      newData: JSON.stringify(newData),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật công ty thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const company = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        branches: true,
        departments: true,
        employees: true,
        childCompanies: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    if (
      (company.branches && (await company.branches).length > 0) ||
      (company.departments && (await company.departments).length > 0) ||
      (company.employees && (await company.employees).length > 0)
    ) {
      throw new BadRequestException(
        'Không thể ngừng hoạt động công ty đang có dữ liệu liên kết (Chi nhánh/Phòng ban/Nhân viên)',
      );
    }

    if (company.childCompanies && (await company.childCompanies).length > 0) {
      throw new BadRequestException(
        'Không thể ngừng hoạt động công ty đang có công ty con',
      );
    }

    await this.repo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Company',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động công ty: ${company.code} - ${company.name}`,
      oldData: JSON.stringify(company),
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Ngừng hoạt động công ty thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const company = await this.repo.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    await this.repo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Company',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt công ty: ${company.code}`,
      oldData: JSON.stringify(company),
      newData: JSON.stringify({ ...company, isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Kích hoạt công ty thành công',
    };
  }

  async findById(id: string) {
    const company = await this.repo.findOne({
      where: { id, isDeleted: false },
      relations: {
        branches: true,
        parts: true,
        departments: true,
        employees: true,
        positions: true,
        logoUrl: true,
        documents: true,
        parentCompany: true,
        childCompanies: true,
        shiftMasters: true,
      },
    });

    if (!company) {
      throw new NotFoundException('Không tìm thấy công ty');
    }

    const result = transformKeys(company);
    return {
      message: 'Lấy thông tin công ty thành công',
      data: result,
    };
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<CompanyEntity> = {};

    if (data.where.code) {
      whereCon.code = ILike(`%${data.where.code}%`);
    }
    if (data.where.name) {
      whereCon.name = ILike(`%${data.where.name}%`);
    }
    if (data.where.taxCode) {
      whereCon.taxCode = ILike(`%${data.where.taxCode}%`);
    }
    if (data.where.address) {
      whereCon.address = ILike(`%${data.where.address}%`);
    }
    if (data.where.email) {
      whereCon.email = ILike(`%${data.where.email}%`);
    }
    if (data.where.phoneNumber) {
      whereCon.phoneNumber = ILike(`%${data.where.phoneNumber}%`);
    }
    if (data.where.parentCompanyId) {
      whereCon.parentCompanyId = data.where.parentCompanyId;
    }
    if (
      data.where.isDeleted !== undefined &&
      data.where.isDeleted !== null &&
      data.where.isDeleted !== ''
    ) {
      whereCon.isDeleted = data.where.isDeleted;
    }

    const [companies, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: {
        logoUrl: true,
        documents: true,
        parentCompany: true,
      },
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: companies,
      total,
    };
  }

  async selectBox() {
    const companies = await this.repo.find({
      where: { isDeleted: false },
      select: { id: true, code: true, name: true },
      order: { name: 'ASC' },
    });

    return companies;
  }

  async getCompanyTree() {
    const companies = await this.repo.find({
      where: { isDeleted: false },
      relations: { childCompanies: true, parentCompany: true },
      order: { name: 'ASC' },
    });

    const rootCompanies = companies.filter((c) => !c.parentCompanyId);

    const buildTree = async (company: CompanyEntity) => {
      const children = await company.childCompanies;
      return {
        ...transformKeys(company),
        children: children ? await Promise.all(children.map(buildTree)) : [],
      };
    };

    const tree = await Promise.all(rootCompanies.map(buildTree));

    return {
      message: 'Lấy cây công ty thành công',
      data: tree,
    };
  }

  async importCompanies(user: UserDto, importDto: ImportCompanyDto) {
    const result = {
      totalRows: importDto.companies.length,
      successRows: 0,
      errorRows: 0,
      errors: [] as Array<{ row: number; code: string; message: string }>,
      createdCompanies: [] as Array<{ id: string; code: string; name: string }>,
    };

    for (let i = 0; i < importDto.companies.length; i++) {
      const company = importDto.companies[i];
      const rowNumber = i + 2;

      try {
        await this.create(user, company);
        result.successRows++;
        result.createdCompanies.push({
          id: '',
          code: company.code,
          name: company.name,
        });
      } catch (error) {
        result.errorRows++;
        result.errors.push({
          row: rowNumber,
          code: company.code,
          message: error.message || 'Lỗi không xác định',
        });
      }
    }

    return {
      message: `Import hoàn tất: ${result.successRows} thành công, ${result.errorRows} lỗi`,
      data: result,
    };
  }
}
