import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PaginationDto, UserDto } from 'src/dto';
import {
  EmployeeCertificateEntity,
  EmployeeEducationEntity,
  EmployeeEntity,
  UserEntity,
  UserRoleEntity,
} from 'src/entities';
import { transformKeys } from 'src/helpers';
import {
  EmployeeCertificateRepository,
  EmployeeEducationRepository,
  EmployeeRepository,
  RoleRepository,
  UploadFileRepository,
  UserRepository,
  UserRoleRepository,
} from 'src/repositories';
import { FindOptionsWhere, ILike, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { enumData } from '../../constants';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { FileArchivalCreateDto } from '../fileArchival/dto';
import { FileArchivalService } from '../fileArchival/fileArchival.service';
import {
  CreateEmployeeCertificateDto,
  CreateEmployeeDto,
  CreateEmployeeEducationDto,
  UpdateEmployeeCertificateDto,
  UpdateEmployeeDto,
  UpdateEmployeeEducationDto,
} from './dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepo: EmployeeRepository,
    private readonly empEduRepo: EmployeeEducationRepository,
    private readonly empCertRepo: EmployeeCertificateRepository,
    private readonly actionLogService: ActionLogService,
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly uploadFileRepo: UploadFileRepository,
    private readonly fileArchivalService: FileArchivalService,
  ) {}

  async findEmployeeById(id: string) {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: {
        avatar: true,
        frontIdCard: true,
        backIdCard: true,
        cvFiles: true,
        contractFiles: true,
        department: true,
        part: true,
        position: true,
        positionMaster: true,
        manager: true,
        company: true,
        branch: true,
        shift: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }

    const employeeUser = await this.userRepo.findOne({
      where: { employeeId: id },
      relations: { userRoles: { role: true } },
    });

    const result = {
      ...transformKeys(employee),
      user: employeeUser
        ? {
            id: employeeUser.id,
            username: employeeUser.username,
            email: employeeUser.email,
            isActive: employeeUser.isActive,
            roles: employeeUser.userRoles?.map((ur) => ur.role) || [],
          }
        : null,
    };

    return {
      message: 'Tìm kiếm nhân viên thành công',
      data: result,
    };
  }

  async selectBoxEmployee() {
    const res: any[] = await this.employeeRepo.find({
      where: { isDeleted: false, status: enumData.EmployeeStatus.WORKING.code },
      select: {
        id: true,
        code: true,
        fullName: true,
        firstName: true,
        departmentId: true,
        positionId: true,
      },
      relations: { department: true, position: true },
    });

    return res;
  }

  async paginationEmployee(user: UserDto, data: PaginationDto) {
    const whereCon: FindOptionsWhere<EmployeeEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.firstName)
      whereCon.firstName = ILike(`%${data.where.firstName}%`);
    if (data.where.fullName)
      whereCon.fullName = ILike(`%${data.where.fullName}%`);
    if (data.where.phone) whereCon.phone = ILike(`%${data.where.phone}%`);
    if (data.where.email) whereCon.email = ILike(`%${data.where.email}%`);
    if (data.where.gender) whereCon.gender = data.where.gender;
    if (data.where.departmentId)
      whereCon.departmentId = data.where.departmentId;
    if (data.where.partId) whereCon.partId = data.where.partId;
    if (data.where.positionId) whereCon.positionId = data.where.positionId;
    if (data.where.positionMasterId)
      whereCon.positionMasterId = data.where.positionMasterId;
    if (data.where.status) whereCon.status = data.where.status;
    if (data.where.workingMode) whereCon.workingMode = data.where.workingMode;
    if (data.where.contractType)
      whereCon.contractType = data.where.contractType;
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [employees, total] = await this.employeeRepo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        avatar: true,
        department: true,
        part: true,
        position: true,
        positionMaster: true,
        manager: true,
        user: true,
      },
    });

    return { data: employees, total };
  }

  async createEmployee(user: UserDto, createDto: CreateEmployeeDto) {
    const existingEmployee = await this.employeeRepo.findOne({
      where: { code: createDto.code },
    });
    if (existingEmployee) {
      throw new BadRequestException('Mã nhân viên đã tồn tại');
    }

    const existingUser = await this.userRepo.findOne({
      where: { username: createDto.code },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Tài khoản với mã nhân viên này đã tồn tại',
      );
    }

    if (createDto.email) {
      const existingEmail = await this.userRepo.findOne({
        where: { email: createDto.email },
      });
      if (existingEmail) {
        throw new BadRequestException(
          'Email đã được sử dụng bởi tài khoản khác',
        );
      }
    }

    const employee = new EmployeeEntity();
    employee.id = uuidv4();
    employee.code = createDto.code;
    employee.lastName = createDto.lastName;
    employee.firstName = createDto.firstName;
    employee.fullName =
      createDto.fullName || `${createDto.lastName} ${createDto.firstName}`;
    employee.phone = createDto.phone;
    employee.secondaryPhone = createDto.secondaryPhone;
    employee.email = createDto.email;
    employee.gender = createDto.gender;
    employee.birthday = createDto.birthday;
    employee.nationality = createDto.nationality || 'Việt Nam';
    employee.ethnicity = createDto.ethnicity;
    employee.religion = createDto.religion;
    employee.maritalStatus = createDto.maritalStatus;
    employee.numberOfDependents = createDto.numberOfDependents || 0;
    employee.identityCard = createDto.identityCard;
    employee.placeOfIssuance = createDto.placeOfIssuance;
    employee.issuanceDate = createDto.issuanceDate;
    employee.permanentAddress = createDto.permanentAddress;
    employee.nowAddress = createDto.nowAddress;
    employee.currentCity = createDto.currentCity;
    employee.currentDistrict = createDto.currentDistrict;
    employee.currentWard = createDto.currentWard;
    employee.passportNumber = createDto.passportNumber;
    employee.passportIssueDate = createDto.passportIssueDate;
    employee.passportExpiryDate = createDto.passportExpiryDate;
    employee.socialInsuranceNumber = createDto.socialInsuranceNumber;
    employee.healthInsuranceNumber = createDto.healthInsuranceNumber;
    employee.bankAccountNumber = createDto.bankAccountNumber;
    employee.bankName = createDto.bankName;
    employee.bankBranch = createDto.bankBranch;
    employee.bankAccountHolder = createDto.bankAccountHolder;
    employee.taxCode = createDto.taxCode;
    employee.companyEmail = createDto.companyEmail;
    employee.companyId = createDto.companyId;
    employee.branchId = createDto.branchId;
    employee.departmentId = createDto.departmentId;
    employee.partId = createDto.partId;
    employee.positionMasterId = createDto.positionMasterId;
    employee.positionId = createDto.positionId;
    employee.level = createDto.level;
    employee.workingMode = createDto.workingMode;
    employee.contractType = createDto.contractType;
    employee.probationStatus = createDto.probationStatus;
    employee.dateStartProbation = createDto.dateStartProbation;
    employee.dateEndProbation = createDto.dateEndProbation;
    employee.dateStartOfficial = createDto.dateStartOfficial;
    employee.joinDate = createDto.joinDate;
    employee.contractSignDate = createDto.contractSignDate;
    employee.contractEndDate = createDto.contractEndDate;
    employee.workingDuration = createDto.workingDuration;
    employee.emergencyContactName = createDto.emergencyContactName;
    employee.emergencyContactRelation = createDto.emergencyContactRelation;
    employee.emergencyContactPhone = createDto.emergencyContactPhone;
    employee.emergencyContactAddress = createDto.emergencyContactAddress;
    employee.status = createDto.status || enumData.EmployeeStatus.WORKING.code;
    employee.resignationDate = createDto.resignationDate;
    employee.resignationReason = createDto.resignationReason;
    employee.description = createDto.description;
    employee.internalNote = createDto.internalNote;
    employee.hasSystemAccess = createDto.hasSystemAccess ?? true;
    employee.receiveNotification = createDto.receiveNotification ?? true;
    employee.managerId = createDto.managerId;
    employee.shiftId = createDto.shiftId;
    employee.createdBy = user.id;
    employee.createdAt = new Date();

    await this.employeeRepo.insert(employee);

    const avatarInput = Array.isArray(createDto.avatar)
      ? createDto.avatar[0]
      : createDto.avatar;
    if (avatarInput?.fileUrl && avatarInput?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: avatarInput.fileUrl,
        fileName: avatarInput.fileName,
        fileType: 'EmployeeAvatar',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'avatarEmployeeId',
        fileRelationId: employee.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const frontIdCard = Array.isArray(createDto.frontIdCard)
      ? createDto.frontIdCard[0]
      : createDto.frontIdCard;
    if (frontIdCard?.fileUrl && frontIdCard?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: frontIdCard.fileUrl,
        fileName: frontIdCard.fileName,
        fileType: 'EmployeeFrontIdCard',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'frontIdCardEmployeeId',
        fileRelationId: employee.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const backIdCard = Array.isArray(createDto.backIdCard)
      ? createDto.backIdCard[0]
      : createDto.backIdCard;
    if (backIdCard?.fileUrl && backIdCard?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: backIdCard.fileUrl,
        fileName: backIdCard.fileName,
        fileType: 'EmployeeBackIdCard',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'backIdCardEmployeeId',
        fileRelationId: employee.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    if (createDto.cvFiles && createDto.cvFiles.length > 0) {
      for (const cvFile of createDto.cvFiles) {
        if (cvFile?.fileUrl && cvFile?.fileName) {
          const fileArchival: FileArchivalCreateDto = {
            fileUrl: cvFile.fileUrl,
            fileName: cvFile.fileName,
            fileType: 'EmployeeCV',
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            fileRelationName: 'cvEmployeeId',
            fileRelationId: employee.id,
          };
          await this.fileArchivalService.create(fileArchival);
        }
      }
    }

    if (createDto.contractFiles && createDto.contractFiles.length > 0) {
      for (const contractFile of createDto.contractFiles) {
        if (contractFile?.fileUrl && contractFile?.fileName) {
          const fileArchival: FileArchivalCreateDto = {
            fileUrl: contractFile.fileUrl,
            fileName: contractFile.fileName,
            fileType: 'EmployeeContract',
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            fileRelationName: 'contractEmployeeId',
            fileRelationId: employee.id,
          };
          await this.fileArchivalService.create(fileArchival);
        }
      }
    }

    const hashedPassword = await bcrypt.hash('ah1425', 10);
    const newUser = new UserEntity();
    newUser.id = uuidv4();
    newUser.username = createDto.code;
    newUser.password = hashedPassword;
    newUser.email = createDto.email;
    newUser.employeeId = employee.id;
    newUser.isActive = true;
    newUser.isAdmin = false;
    newUser.createdBy = user.id;
    newUser.createdAt = new Date();

    await this.userRepo.insert(newUser);

    if (createDto.roleIds && createDto.roleIds.length > 0) {
      const roles = await this.roleRepo.find({
        where: { id: In(createDto.roleIds) },
      });
      if (roles.length > 0) {
        const userRoles = roles.map((role) => {
          const ur = new UserRoleEntity();
          ur.userId = newUser.id;
          ur.roleId = role.id;
          ur.assignedById = user.id;
          ur.createdBy = user.id;
          return ur;
        });
        await this.userRoleRepo.save(userRoles);
      }
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: employee.id,
      functionType: 'Employee',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới nhân viên: ${employee.code}`,
      oldData: '{}',
      newData: JSON.stringify(employee),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới nhân viên thành công',
      data: { id: employee.id },
    };
  }

  async updateEmployee(user: UserDto, updateDto: UpdateEmployeeDto) {
    const employee = await this.employeeRepo.findOne({
      where: { id: updateDto.id },
    });

    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên cần cập nhật');
    }

    if (updateDto.code && updateDto.code !== employee.code) {
      const existingCode = await this.employeeRepo.findOne({
        where: { code: updateDto.code },
      });
      if (existingCode) {
        throw new BadRequestException('Mã nhân viên đã tồn tại');
      }
    }

    const oldEmployeeData = JSON.stringify(employee);

    const employeeUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.code) employeeUpdateData.code = updateDto.code;
    if (updateDto.lastName) employeeUpdateData.lastName = updateDto.lastName;
    if (updateDto.firstName) employeeUpdateData.firstName = updateDto.firstName;
    if (updateDto.fullName) employeeUpdateData.fullName = updateDto.fullName;
    if (updateDto.phone) employeeUpdateData.phone = updateDto.phone;
    if (updateDto.email !== undefined)
      employeeUpdateData.email = updateDto.email;
    if (updateDto.secondaryPhone !== undefined)
      employeeUpdateData.secondaryPhone = updateDto.secondaryPhone;
    if (updateDto.companyEmail !== undefined)
      employeeUpdateData.companyEmail = updateDto.companyEmail;
    if (updateDto.gender) employeeUpdateData.gender = updateDto.gender;
    if (updateDto.birthday !== undefined)
      employeeUpdateData.birthday = updateDto.birthday;
    if (updateDto.nationality !== undefined)
      employeeUpdateData.nationality = updateDto.nationality;
    if (updateDto.ethnicity !== undefined)
      employeeUpdateData.ethnicity = updateDto.ethnicity;
    if (updateDto.religion !== undefined)
      employeeUpdateData.religion = updateDto.religion;
    if (updateDto.maritalStatus !== undefined)
      employeeUpdateData.maritalStatus = updateDto.maritalStatus;
    if (updateDto.numberOfDependents !== undefined)
      employeeUpdateData.numberOfDependents = updateDto.numberOfDependents;
    if (updateDto.identityCard !== undefined)
      employeeUpdateData.identityCard = updateDto.identityCard;
    if (updateDto.placeOfIssuance !== undefined)
      employeeUpdateData.placeOfIssuance = updateDto.placeOfIssuance;
    if (updateDto.issuanceDate !== undefined)
      employeeUpdateData.issuanceDate = updateDto.issuanceDate;
    if (updateDto.permanentAddress !== undefined)
      employeeUpdateData.permanentAddress = updateDto.permanentAddress;
    if (updateDto.nowAddress !== undefined)
      employeeUpdateData.nowAddress = updateDto.nowAddress;
    if (updateDto.currentCity !== undefined)
      employeeUpdateData.currentCity = updateDto.currentCity;
    if (updateDto.currentDistrict !== undefined)
      employeeUpdateData.currentDistrict = updateDto.currentDistrict;
    if (updateDto.currentWard !== undefined)
      employeeUpdateData.currentWard = updateDto.currentWard;
    if (updateDto.passportNumber !== undefined)
      employeeUpdateData.passportNumber = updateDto.passportNumber;
    if (updateDto.passportIssueDate !== undefined)
      employeeUpdateData.passportIssueDate = updateDto.passportIssueDate;
    if (updateDto.passportExpiryDate !== undefined)
      employeeUpdateData.passportExpiryDate = updateDto.passportExpiryDate;
    if (updateDto.socialInsuranceNumber !== undefined)
      employeeUpdateData.socialInsuranceNumber =
        updateDto.socialInsuranceNumber;
    if (updateDto.healthInsuranceNumber !== undefined)
      employeeUpdateData.healthInsuranceNumber =
        updateDto.healthInsuranceNumber;
    if (updateDto.bankAccountNumber !== undefined)
      employeeUpdateData.bankAccountNumber = updateDto.bankAccountNumber;
    if (updateDto.bankName !== undefined)
      employeeUpdateData.bankName = updateDto.bankName;
    if (updateDto.bankBranch !== undefined)
      employeeUpdateData.bankBranch = updateDto.bankBranch;
    if (updateDto.bankAccountHolder !== undefined)
      employeeUpdateData.bankAccountHolder = updateDto.bankAccountHolder;
    if (updateDto.taxCode !== undefined)
      employeeUpdateData.taxCode = updateDto.taxCode;
    if (updateDto.companyId !== undefined)
      employeeUpdateData.companyId = updateDto.companyId;
    if (updateDto.branchId !== undefined)
      employeeUpdateData.branchId = updateDto.branchId;
    if (updateDto.departmentId !== undefined)
      employeeUpdateData.departmentId = updateDto.departmentId;
    if (updateDto.partId !== undefined)
      employeeUpdateData.partId = updateDto.partId;
    if (updateDto.positionMasterId !== undefined)
      employeeUpdateData.positionMasterId = updateDto.positionMasterId;
    if (updateDto.positionId !== undefined)
      employeeUpdateData.positionId = updateDto.positionId;
    if (updateDto.level !== undefined)
      employeeUpdateData.level = updateDto.level;
    if (updateDto.workingMode !== undefined)
      employeeUpdateData.workingMode = updateDto.workingMode;
    if (updateDto.contractType !== undefined)
      employeeUpdateData.contractType = updateDto.contractType;
    if (updateDto.probationStatus !== undefined)
      employeeUpdateData.probationStatus = updateDto.probationStatus;
    if (updateDto.dateStartProbation !== undefined)
      employeeUpdateData.dateStartProbation = updateDto.dateStartProbation;
    if (updateDto.dateEndProbation !== undefined)
      employeeUpdateData.dateEndProbation = updateDto.dateEndProbation;
    if (updateDto.dateStartOfficial !== undefined)
      employeeUpdateData.dateStartOfficial = updateDto.dateStartOfficial;
    if (updateDto.joinDate !== undefined)
      employeeUpdateData.joinDate = updateDto.joinDate;
    if (updateDto.contractSignDate !== undefined)
      employeeUpdateData.contractSignDate = updateDto.contractSignDate;
    if (updateDto.contractEndDate !== undefined)
      employeeUpdateData.contractEndDate = updateDto.contractEndDate;
    if (updateDto.workingDuration !== undefined)
      employeeUpdateData.workingDuration = updateDto.workingDuration;
    if (updateDto.emergencyContactName !== undefined)
      employeeUpdateData.emergencyContactName = updateDto.emergencyContactName;
    if (updateDto.emergencyContactRelation !== undefined)
      employeeUpdateData.emergencyContactRelation =
        updateDto.emergencyContactRelation;
    if (updateDto.emergencyContactPhone !== undefined)
      employeeUpdateData.emergencyContactPhone =
        updateDto.emergencyContactPhone;
    if (updateDto.emergencyContactAddress !== undefined)
      employeeUpdateData.emergencyContactAddress =
        updateDto.emergencyContactAddress;
    if (updateDto.status !== undefined)
      employeeUpdateData.status = updateDto.status;
    if (updateDto.resignationDate !== undefined)
      employeeUpdateData.resignationDate = updateDto.resignationDate;
    if (updateDto.resignationReason !== undefined)
      employeeUpdateData.resignationReason = updateDto.resignationReason;
    if (updateDto.description !== undefined)
      employeeUpdateData.description = updateDto.description;
    if (updateDto.internalNote !== undefined)
      employeeUpdateData.internalNote = updateDto.internalNote;
    if (updateDto.hasSystemAccess !== undefined)
      employeeUpdateData.hasSystemAccess = updateDto.hasSystemAccess;
    if (updateDto.receiveNotification !== undefined)
      employeeUpdateData.receiveNotification = updateDto.receiveNotification;
    if (updateDto.managerId !== undefined)
      employeeUpdateData.managerId = updateDto.managerId;
    if (updateDto.shiftId !== undefined)
      employeeUpdateData.shiftId = updateDto.shiftId;

    await this.employeeRepo.update(updateDto.id, employeeUpdateData);

    if (Object.prototype.hasOwnProperty.call(updateDto, 'avatar')) {
      await this.uploadFileRepo.delete({ avatarEmployeeId: updateDto.id });
      const avatarInput = Array.isArray(updateDto.avatar)
        ? updateDto.avatar[0]
        : updateDto.avatar;
      if (avatarInput?.fileUrl && avatarInput?.fileName) {
        const fileArchival: FileArchivalCreateDto = {
          fileUrl: avatarInput.fileUrl,
          fileName: avatarInput.fileName,
          fileType: 'EmployeeAvatar',
          createdBy: user.id,
          createdAt: new Date().toISOString(),
          fileRelationName: 'avatarEmployeeId',
          fileRelationId: updateDto.id,
        };
        await this.fileArchivalService.create(fileArchival);
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateDto, 'frontIdCard')) {
      await this.uploadFileRepo.delete({ frontIdCardEmployeeId: updateDto.id });
      const frontIdCard = Array.isArray(updateDto.frontIdCard)
        ? updateDto.frontIdCard[0]
        : updateDto.frontIdCard;
      if (frontIdCard?.fileUrl && frontIdCard?.fileName) {
        const fileArchival: FileArchivalCreateDto = {
          fileUrl: frontIdCard.fileUrl,
          fileName: frontIdCard.fileName,
          fileType: 'EmployeeFrontIdCard',
          createdBy: user.id,
          createdAt: new Date().toISOString(),
          fileRelationName: 'frontIdCardEmployeeId',
          fileRelationId: updateDto.id,
        };
        await this.fileArchivalService.create(fileArchival);
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateDto, 'backIdCard')) {
      await this.uploadFileRepo.delete({ backIdCardEmployeeId: updateDto.id });
      const backIdCard = Array.isArray(updateDto.backIdCard)
        ? updateDto.backIdCard[0]
        : updateDto.backIdCard;
      if (backIdCard?.fileUrl && backIdCard?.fileName) {
        const fileArchival: FileArchivalCreateDto = {
          fileUrl: backIdCard.fileUrl,
          fileName: backIdCard.fileName,
          fileType: 'EmployeeBackIdCard',
          createdBy: user.id,
          createdAt: new Date().toISOString(),
          fileRelationName: 'backIdCardEmployeeId',
          fileRelationId: updateDto.id,
        };
        await this.fileArchivalService.create(fileArchival);
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateDto, 'cvFiles')) {
      await this.uploadFileRepo.delete({ cvEmployeeId: updateDto.id });
      if (updateDto.cvFiles && updateDto.cvFiles.length > 0) {
        for (const cvFile of updateDto.cvFiles) {
          if (cvFile?.fileUrl && cvFile?.fileName) {
            const fileArchival: FileArchivalCreateDto = {
              fileUrl: cvFile.fileUrl,
              fileName: cvFile.fileName,
              fileType: 'EmployeeCV',
              createdBy: user.id,
              createdAt: new Date().toISOString(),
              fileRelationName: 'cvEmployeeId',
              fileRelationId: updateDto.id,
            };
            await this.fileArchivalService.create(fileArchival);
          }
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateDto, 'contractFiles')) {
      await this.uploadFileRepo.delete({ contractEmployeeId: updateDto.id });
      if (updateDto.contractFiles && updateDto.contractFiles.length > 0) {
        for (const contractFile of updateDto.contractFiles) {
          if (contractFile?.fileUrl && contractFile?.fileName) {
            const fileArchival: FileArchivalCreateDto = {
              fileUrl: contractFile.fileUrl,
              fileName: contractFile.fileName,
              fileType: 'EmployeeContract',
              createdBy: user.id,
              createdAt: new Date().toISOString(),
              fileRelationName: 'contractEmployeeId',
              fileRelationId: updateDto.id,
            };
            await this.fileArchivalService.create(fileArchival);
          }
        }
      }
    }

    const empUser = await this.userRepo.findOne({
      where: { employeeId: employee.id },
    });

    if (updateDto.email && empUser && updateDto.email !== empUser.email) {
      const existEmail = await this.userRepo.findOne({
        where: { email: updateDto.email },
      });
      if (existEmail && existEmail.id !== empUser.id) {
        throw new BadRequestException(
          'Email cập nhật đã tồn tại ở tài khoản khác',
        );
      }
      await this.userRepo.update(empUser.id, { email: updateDto.email });
    }

    if (updateDto.roleIds && empUser) {
      await this.userRoleRepo.delete({ userId: empUser.id });

      if (updateDto.roleIds.length > 0) {
        const roles = await this.roleRepo.find({
          where: { id: In(updateDto.roleIds) },
        });

        if (roles.length > 0) {
          const userRoles = roles.map((role) => {
            const ur = new UserRoleEntity();
            ur.userId = empUser.id;
            ur.roleId = role.id;
            ur.assignedById = user.id;
            ur.createdAt = new Date();
            ur.createdBy = user.id;
            return ur;
          });
          await this.userRoleRepo.save(userRoles);
        }
      }
    }

    const updatedEmployee = await this.employeeRepo.findOne({
      where: { id: employee.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: employee.id,
      functionType: 'Employee',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật nhân viên: ${employee.code}`,
      oldData: oldEmployeeData,
      newData: JSON.stringify(updatedEmployee),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật nhân viên thành công',
    };
  }

  async deactivateEmployee(user: UserDto, id: string) {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Không tìm thấy nhân viên');

    await this.employeeRepo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const empUser = await this.userRepo.findOne({ where: { employeeId: id } });
    if (empUser) {
      await this.userRepo.update(empUser.id, {
        isActive: false,
        updatedBy: user.id,
        updatedAt: new Date(),
      });
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Employee',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngưng hoạt động nhân viên: ${employee.code}`,
      oldData: '',
      newData: JSON.stringify({ isDeleted: true }),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Ngưng hoạt động nhân viên thành công' };
  }

  async activateEmployee(user: UserDto, id: string) {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Không tìm thấy nhân viên');

    await this.employeeRepo.update(id, {
      isDeleted: false,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const empUser = await this.userRepo.findOne({ where: { employeeId: id } });
    if (empUser) {
      await this.userRepo.update(empUser.id, {
        isActive: true,
        updatedBy: user.id,
        updatedAt: new Date(),
      });
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'Employee',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt nhân viên: ${employee.code}`,
      oldData: '',
      newData: JSON.stringify({ isDeleted: false }),
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Kích hoạt nhân viên thành công' };
  }

  async changeEmployeePassword(
    user: UserDto,
    data: { employeeId: string; newPassword: string },
  ) {
    const employee = await this.employeeRepo.findOne({
      where: { id: data.employeeId },
    });
    if (!employee) throw new NotFoundException('Không tìm thấy nhân viên');

    const empUser = await this.userRepo.findOne({
      where: { employeeId: data.employeeId },
    });
    if (!empUser)
      throw new NotFoundException('Nhân viên chưa có tài khoản hệ thống');

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await this.userRepo.update(empUser.id, {
      password: hashedPassword,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: employee.id,
      functionType: 'Employee',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Đổi mật khẩu cho nhân viên: ${employee.code}`,
      oldData: '',
      newData: 'Password Changed',
    };
    await this.actionLogService.create(actionLogDto);

    return { message: 'Đổi mật khẩu thành công' };
  }

  async findEmployeesByCodes(codes: string[]) {
    return await this.employeeRepo.find({
      where: {
        code: In(codes),
        isDeleted: false,
      },
      relations: {
        department: true,
        part: true,
        position: true,
        positionMaster: true,
      },
    });
  }

  async findEmployeeEducationById(id: string) {
    const education = await this.empEduRepo.findOne({
      where: { id },
      relations: {
        employee: true,
        documents: true,
      },
    });

    if (!education) {
      throw new NotFoundException('Không tìm thấy thông tin học vấn');
    }

    return {
      message: 'Tìm kiếm thông tin học vấn thành công',
      data: education,
    };
  }

  async findEmployeeEducationsByEmployeeId(employeeId: string) {
    const educations = await this.empEduRepo.find({
      where: { employeeId, isDeleted: false },
      relations: {
        documents: true,
      },
      order: { graduationYear: 'DESC' },
    });

    return {
      message: 'Lấy danh sách học vấn thành công',
      data: educations,
    };
  }

  async paginationEmployeeEducation(user: UserDto, data: PaginationDto) {
    const whereCon: FindOptionsWhere<EmployeeEducationEntity> = {};

    if (data.where.employeeId) whereCon.employeeId = data.where.employeeId;
    if (data.where.school) whereCon.school = ILike(`%${data.where.school}%`);
    if (data.where.educationLevel)
      whereCon.educationLevel = data.where.educationLevel;
    if (data.where.major) whereCon.major = ILike(`%${data.where.major}%`);
    if (data.where.graduationYear)
      whereCon.graduationYear = data.where.graduationYear;
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [educations, total] = await this.empEduRepo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        employee: true,
        documents: true,
      },
    });

    return { data: educations, total };
  }

  async createEmployeeEducation(
    user: UserDto,
    createDto: CreateEmployeeEducationDto,
  ) {
    const employee = await this.employeeRepo.findOne({
      where: { id: createDto.employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Không tìm thấy nhân viên');
    }

    if (
      createDto.startYear &&
      createDto.endYear &&
      createDto.startYear > createDto.endYear
    ) {
      throw new BadRequestException(
        'Năm bắt đầu không thể lớn hơn năm kết thúc',
      );
    }

    const education = new EmployeeEducationEntity();
    education.id = uuidv4();
    education.employeeId = createDto.employeeId;
    education.school = createDto.school;
    education.educationLevel = createDto.educationLevel;
    education.major = createDto.major;
    education.graduationYear = createDto.graduationYear;
    education.languages = createDto.languages;
    education.certificates = createDto.certificates;
    education.skills = createDto.skills;
    education.startYear = createDto.startYear;
    education.endYear = createDto.endYear;
    education.gpa = createDto.gpa;
    education.createdBy = user.id;
    education.createdAt = new Date();

    await this.empEduRepo.insert(education);

    if (createDto.documents && createDto.documents.length > 0) {
      for (const doc of createDto.documents) {
        if (doc?.fileUrl && doc?.fileName) {
          const fileArchival: FileArchivalCreateDto = {
            fileUrl: doc.fileUrl,
            fileName: doc.fileName,
            fileType: 'EmployeeEducationDocument',
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            fileRelationName: 'employeeEducationId',
            fileRelationId: education.id,
          };
          await this.fileArchivalService.create(fileArchival);
        }
      }
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: education.id,
      functionType: 'EmployeeEducation',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới thông tin học vấn cho nhân viên: ${employee.code}`,
      oldData: '{}',
      newData: JSON.stringify(education),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới thông tin học vấn thành công',
      data: { id: education.id },
    };
  }

  async updateEmployeeEducation(
    user: UserDto,
    updateDto: UpdateEmployeeEducationDto,
  ) {
    const education = await this.empEduRepo.findOne({
      where: { id: updateDto.id },
    });

    if (!education) {
      throw new NotFoundException(
        'Không tìm thấy thông tin học vấn cần cập nhật',
      );
    }

    if (
      updateDto.startYear &&
      updateDto.endYear &&
      updateDto.startYear > updateDto.endYear
    ) {
      throw new BadRequestException(
        'Năm bắt đầu không thể lớn hơn năm kết thúc',
      );
    }

    const oldEducationData = JSON.stringify(education);

    const educationUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.school !== undefined)
      educationUpdateData.school = updateDto.school;
    if (updateDto.educationLevel !== undefined)
      educationUpdateData.educationLevel = updateDto.educationLevel;
    if (updateDto.major !== undefined)
      educationUpdateData.major = updateDto.major;
    if (updateDto.graduationYear !== undefined)
      educationUpdateData.graduationYear = updateDto.graduationYear;
    if (updateDto.languages !== undefined)
      educationUpdateData.languages = updateDto.languages;
    if (updateDto.certificates !== undefined)
      educationUpdateData.certificates = updateDto.certificates;
    if (updateDto.skills !== undefined)
      educationUpdateData.skills = updateDto.skills;
    if (updateDto.startYear !== undefined)
      educationUpdateData.startYear = updateDto.startYear;
    if (updateDto.endYear !== undefined)
      educationUpdateData.endYear = updateDto.endYear;
    if (updateDto.gpa !== undefined) educationUpdateData.gpa = updateDto.gpa;

    await this.empEduRepo.update(updateDto.id, educationUpdateData);

    if (Object.prototype.hasOwnProperty.call(updateDto, 'documents')) {
      await this.uploadFileRepo.delete({ employeeEducationId: updateDto.id });
      if (updateDto.documents && updateDto.documents.length > 0) {
        for (const doc of updateDto.documents) {
          if (doc?.fileUrl && doc?.fileName) {
            const fileArchival: FileArchivalCreateDto = {
              fileUrl: doc.fileUrl,
              fileName: doc.fileName,
              fileType: 'EmployeeEducationDocument',
              createdBy: user.id,
              createdAt: new Date().toISOString(),
              fileRelationName: 'employeeEducationId',
              fileRelationId: updateDto.id,
            };
            await this.fileArchivalService.create(fileArchival);
          }
        }
      }
    }

    const updatedEducation = await this.empEduRepo.findOne({
      where: { id: education.id },
    });

    const employee = await this.employeeRepo.findOne({
      where: { id: education.employeeId },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: education.id,
      functionType: 'EmployeeEducation',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật thông tin học vấn cho nhân viên: ${employee?.code || 'N/A'}`,
      oldData: oldEducationData,
      newData: JSON.stringify(updatedEducation),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật thông tin học vấn thành công',
    };
  }

  async deleteEmployeeEducation(user: UserDto, id: string) {
    const education = await this.empEduRepo.findOne({ where: { id } });
    if (!education)
      throw new NotFoundException('Không tìm thấy thông tin học vấn');

    await this.empEduRepo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const employee = await this.employeeRepo.findOne({
      where: { id: education.employeeId },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'EmployeeEducation',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Xóa thông tin học vấn của nhân viên: ${employee?.code || 'N/A'}`,
      oldData: JSON.stringify(education),
      newData: JSON.stringify({ isDeleted: true }),
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Xóa thông tin học vấn thành công' };
  }

  async findEmployeeCertificateById(id: string) {
    const certificate = await this.empCertRepo.findOne({
      where: { id },
      relations: {
        employee: true,
        documents: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException('Không tìm thấy thông tin chứng chỉ');
    }

    return {
      message: 'Tìm kiếm thông tin chứng chỉ thành công',
      data: certificate,
    };
  }

  async findEmployeeCertificatesByEmployeeId(employeeId: string) {
    const certificates = await this.empCertRepo.find({
      where: { employeeId, isDeleted: false },
      relations: {
        documents: true,
      },
      order: { issueDate: 'DESC' },
    });

    return {
      message: 'Lấy danh sách chứng chỉ thành công',
      data: certificates,
    };
  }

  async paginationEmployeeCertificate(user: UserDto, data: PaginationDto) {
    const whereCon: FindOptionsWhere<EmployeeCertificateEntity> = {};

    if (data.where.employeeId) whereCon.employeeId = data.where.employeeId;
    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.issuingOrganization)
      whereCon.issuingOrganization = ILike(
        `%${data.where.issuingOrganization}%`,
      );
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [certificates, total] = await this.empCertRepo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
      relations: {
        employee: true,
        documents: true,
      },
    });

    return { data: certificates, total };
  }

  async createEmployeeCertificate(
    user: UserDto,
    createDto: CreateEmployeeCertificateDto,
  ) {
    const employee = await this.employeeRepo.findOne({
      where: { id: createDto.employeeId },
    });

    if (!employee) {
      throw new BadRequestException('Không tìm thấy nhân viên');
    }

    const certificate = new EmployeeCertificateEntity();
    certificate.id = uuidv4();
    certificate.employeeId = createDto.employeeId;
    certificate.code = createDto.code;
    certificate.name = createDto.name;
    certificate.issueDate = createDto.issueDate;
    certificate.expiryDate = createDto.expiryDate;
    certificate.issuingOrganization = createDto.issuingOrganization;
    certificate.createdBy = user.id;
    certificate.createdAt = new Date();

    await this.empCertRepo.insert(certificate);

    if (createDto.documents && createDto.documents.length > 0) {
      for (const doc of createDto.documents) {
        if (doc?.fileUrl && doc?.fileName) {
          const fileArchival: FileArchivalCreateDto = {
            fileUrl: doc.fileUrl,
            fileName: doc.fileName,
            fileType: 'EmployeeCertificateDocument',
            createdBy: user.id,
            createdAt: new Date().toISOString(),
            fileRelationName: 'employeeCertificateId',
            fileRelationId: certificate.id,
          };
          await this.fileArchivalService.create(fileArchival);
        }
      }
    }

    const actionLogDto: ActionLogCreateDto = {
      functionId: certificate.id,
      functionType: 'EmployeeCertificate',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới chứng chỉ cho nhân viên: ${employee.code}`,
      oldData: '{}',
      newData: JSON.stringify(certificate),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới chứng chỉ thành công',
      data: { id: certificate.id },
    };
  }

  async updateEmployeeCertificate(
    user: UserDto,
    updateDto: UpdateEmployeeCertificateDto,
  ) {
    const certificate = await this.empCertRepo.findOne({
      where: { id: updateDto.id },
    });

    if (!certificate) {
      throw new NotFoundException('Không tìm thấy chứng chỉ cần cập nhật');
    }

    const oldCertificateData = JSON.stringify(certificate);

    const certificateUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.name !== undefined)
      certificateUpdateData.name = updateDto.name;
    if (updateDto.code !== undefined)
      certificateUpdateData.code = updateDto.code;
    if (updateDto.issueDate !== undefined)
      certificateUpdateData.issueDate = updateDto.issueDate;
    if (updateDto.expiryDate !== undefined)
      certificateUpdateData.expiryDate = updateDto.expiryDate;
    if (updateDto.issuingOrganization !== undefined)
      certificateUpdateData.issuingOrganization = updateDto.issuingOrganization;

    await this.empCertRepo.update(updateDto.id, certificateUpdateData);

    if (Object.prototype.hasOwnProperty.call(updateDto, 'documents')) {
      await this.uploadFileRepo.delete({
        employeeCertificateId: updateDto.id,
      });
      if (updateDto.documents && updateDto.documents.length > 0) {
        for (const doc of updateDto.documents) {
          if (doc?.fileUrl && doc?.fileName) {
            const fileArchival: FileArchivalCreateDto = {
              fileUrl: doc.fileUrl,
              fileName: doc.fileName,
              fileType: 'EmployeeCertificateDocument',
              createdBy: user.id,
              createdAt: new Date().toISOString(),
              fileRelationName: 'employeeCertificateId',
              fileRelationId: updateDto.id,
            };
            await this.fileArchivalService.create(fileArchival);
          }
        }
      }
    }

    const updatedCertificate = await this.empCertRepo.findOne({
      where: { id: certificate.id },
    });

    const employee = await this.employeeRepo.findOne({
      where: { id: certificate.employeeId },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: certificate.id,
      functionType: 'EmployeeCertificate',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật chứng chỉ cho nhân viên: ${employee?.code || 'N/A'}`,
      oldData: oldCertificateData,
      newData: JSON.stringify(updatedCertificate),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật chứng chỉ thành công',
    };
  }

  async deleteEmployeeCertificate(user: UserDto, id: string) {
    const certificate = await this.empCertRepo.findOne({ where: { id } });
    if (!certificate) throw new NotFoundException('Không tìm thấy chứng chỉ');

    await this.empCertRepo.update(id, {
      isDeleted: true,
      updatedBy: user.id,
      updatedAt: new Date(),
    });

    const employee = await this.employeeRepo.findOne({
      where: { id: certificate.employeeId },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: id,
      functionType: 'EmployeeCertificate',
      type: enumData.ActionLogType.DELETE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Xóa chứng chỉ của nhân viên: ${employee?.code || 'N/A'}`,
      oldData: JSON.stringify(certificate),
      newData: JSON.stringify({ isDeleted: true }),
    };

    await this.actionLogService.create(actionLogDto);

    return { message: 'Xóa chứng chỉ thành công' };
  }
}
