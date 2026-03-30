import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { customAlphabet } from 'nanoid';
import { enumData } from 'src/common/constants';
import {
  UploadedFileMeta,
  assertXlsxFile,
} from 'src/common/upload/xlsx-upload.util';
import { PaginationDto, UserDto } from 'src/dto';
import { UserEntity } from 'src/entities';
import { TourGuideEntity, VerifyOtpEntity } from 'src/entities/user';
import { coreHelper, transformKeys } from 'src/helpers';
import {
  FileArchivalRepository,
  TourGuideRepository,
  UserRepository,
  VerifyOtpRepository,
} from 'src/repositories';
import { FindOptionsWhere, ILike, In, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';
import { EmailService } from '../email/email.service';
import { FileArchivalCreateDto } from '../file-archival/dto';
import { FileArchivalService } from '../file-archival/file-archival.service';
import { ZaloService } from '../zalo/zalo.service';
import {
  ChangePasswordTourGuideDto,
  CheckPhoneEmailTourGuideDto,
  CreateTourGuideDto,
  ForgotPasswordTourGuideDto,
  ImportTourGuideRowDto,
  SendOtpTourGuideDto,
  UpdateTourGuideAvatarDto,
  UpdateTourGuideDto,
  VerifyOtpDto,
} from './dto';

@Injectable()
export class TourGuideService {
  constructor(
    private readonly repo: TourGuideRepository,
    private readonly userRepo: UserRepository,
    private readonly fileArchivalService: FileArchivalService,
    private readonly actionLogService: ActionLogService,
    private readonly verifyRepo: VerifyOtpRepository,
    private readonly fileArchivalRepo: FileArchivalRepository,
    private readonly zaloService: ZaloService,
    private readonly emailService: EmailService,
  ) {}

  private generateOtpCode() {
    const generate = customAlphabet('0123456789', 6);
    return generate();
  }

  private genCodeTourGuide() {
    const generate = customAlphabet('0123456789', 8);
    return `HDV${generate()}`;
  }

  async findById(id: string) {
    const result = await this.repo.findOne({
      where: { id },
      relations: {
        avatar: true,
        user: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');
    }
    const userEntity = await result.user;
    let safeUser: any = null;
    if (userEntity) {
      const tempUser = { ...userEntity };
      delete (tempUser as any).password;
      delete (tempUser as any).refreshToken;
      safeUser = tempUser;
    }
    const finalData = {
      ...result,
      user: safeUser,
    };

    const data = transformKeys(finalData);

    return {
      message: 'Tìm kiếm hướng dẫn viên thành công',
      data,
    };
  }

  async findBySlug(slug: string) {
    const result = await this.repo.findOne({
      where: { slug },
      relations: {
        avatar: true,
        user: true,
      },
    });

    if (!result) {
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');
    }
    const userEntity = await result.user;
    let safeUser: any = null;
    if (userEntity) {
      const tempUser = { ...userEntity };
      delete (tempUser as any).password;
      delete (tempUser as any).refreshToken;
      safeUser = tempUser;
    }
    const finalData = {
      ...result,
      user: safeUser,
    };

    const data = transformKeys(finalData);

    return {
      message: 'Tìm kiếm hướng dẫn viên thành công',
      data,
    };
  }

  async findByPhoneEmail(phone: string, email: string, user: UserDto) {
    const res = await this.repo.find({
      where: [
        { phone: phone, isDeleted: false },
        { email: email, isDeleted: false },
      ],
    });
    if (res?.length !== 0 && res[0].id === user.tourGuideId) {
      return [];
    }
    return res;
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

  async checkPhoneAndEmail(
    data: CheckPhoneEmailTourGuideDto,
    options?: { tourGuideId?: string; skipDuprValidation?: boolean },
  ) {
    let tourGuide: TourGuideEntity | null = null;
    if (options?.tourGuideId) {
      tourGuide = await this.repo.findOne({
        where: { id: options?.tourGuideId },
        select: { id: true, phone: true, email: true },
      });
    }
    if (data.phone) {
      const phoneWhere: FindOptionsWhere<TourGuideEntity> = {
        phone: In([data.phone, coreHelper.normalizePhoneNumber(data.phone)]),
        isDeleted: false,
      };
      if (options?.tourGuideId) {
        phoneWhere.id = Not(options.tourGuideId);
      }
      const checkPhone = await this.repo.findOne({
        where: phoneWhere,
      });
      if (checkPhone) {
        if (checkPhone.isDeleted) {
          throw new NotFoundException('Số điện thoại đã bị khóa');
        }
        throw new NotFoundException('Số điện thoại đã tồn tại');
      }
    }

    if (data.email && (!tourGuide || tourGuide.email != data.email)) {
      const emailWhere: FindOptionsWhere<TourGuideEntity> = {
        email: data.email,
        isDeleted: false,
      };
      if (options?.tourGuideId) {
        emailWhere.id = Not(options.tourGuideId);
      }
      const checkEmail = await this.repo.findOne({
        where: emailWhere,
      });
      if (checkEmail) {
        if (checkEmail.isDeleted) {
          throw new NotFoundException('Email đã bị khóa');
        }
        throw new NotFoundException('Email đã tồn tại');
      }
    }

    return true;
  }

  private async checkOtpCode(data: {
    phone: string;
    email?: string;
    sendMethod: string;
    otpCode?: string;
  }) {
    const where: FindOptionsWhere<VerifyOtpEntity> = {
      sendMethod: data.sendMethod,
      otpCode: data.otpCode,
    };
    if (data.sendMethod === enumData.OTPSendMethod.ZALO) {
      where.phone = data.phone;
    } else if (data.sendMethod === enumData.OTPSendMethod.EMAIL) {
      where.email = data.email;
    }

    const foundOtp = await this.verifyRepo.findOne({
      where,
      order: { dateExpired: 'DESC' },
    });
    if (!foundOtp) {
      throw new NotFoundException('Mã xác thực không đúng');
    }
    if (foundOtp.dateExpired.getTime() < new Date().getTime()) {
      throw new NotFoundException('Mã xác thực đã hết hạn');
    }
    return true;
  }

  async pagination(data: PaginationDto) {
    const whereCon: FindOptionsWhere<TourGuideEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if (data.where.phone) whereCon.phone = ILike(`%${data.where.phone}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [tourGuides, total] = await this.repo.findAndCount({
      where: whereCon,
      relations: {
        avatar: true,
      },
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: tourGuides,
      total,
    };
  }

  async create(user: UserDto, createDto: CreateTourGuideDto) {
    await this.checkPhoneAndEmail({
      phone: createDto.phone,
      email: createDto.email,
    });

    const tourGuide = new TourGuideEntity();
    tourGuide.id = uuidv4();
    tourGuide.code = this.genCodeTourGuide();
    tourGuide.name = createDto.name;
    tourGuide.phone = createDto.phone;
    tourGuide.slug = coreHelper.generateSlug(tourGuide.name);
    let isUnique = false;
    let attempt = 0;
    const maxAttempts = 5;
    while (!isUnique && attempt < maxAttempts) {
      const existing = await this.repo.findOne({
        where: { slug: tourGuide.slug },
      });
      if (!existing) {
        isUnique = true;
      } else {
        tourGuide.slug = `${coreHelper.generateSlug(tourGuide.name)}-${customAlphabet('0123456789', 3)()}`;
        attempt++;
      }
    }

    if (!isUnique) {
      tourGuide.slug = `hdv-${tourGuide.code.toLowerCase()}`;
    }
    tourGuide.email = createDto.email;
    tourGuide.address = createDto.address;
    tourGuide.gender = createDto.gender;
    tourGuide.birthday = createDto.birthday;
    tourGuide.nationality = createDto.nationality;
    tourGuide.identityCard = createDto.identityCard;
    tourGuide.passportNumber = createDto.passportNumber;
    tourGuide.shortBio = createDto.shortBio;
    tourGuide.bio = createDto.bio;
    tourGuide.languages = createDto.languages;
    tourGuide.specialties = createDto.specialties;
    tourGuide.yearsOfExperience = createDto.yearsOfExperience;
    tourGuide.licenseNumber = createDto.licenseNumber;
    tourGuide.licenseIssuedDate = createDto.licenseIssuedDate;
    tourGuide.licenseExpiryDate = createDto.licenseExpiryDate;
    tourGuide.licenseIssuedBy = createDto.licenseIssuedBy;
    tourGuide.averageRating = createDto.averageRating;
    tourGuide.totalReviews = createDto.totalReviews;
    tourGuide.totalToursCompleted = createDto.totalToursCompleted;
    tourGuide.description = createDto.description;
    tourGuide.baseSalary = createDto.baseSalary;
    tourGuide.commissionRate = createDto.commissionRate;
    tourGuide.startDate = createDto.startDate;
    tourGuide.endDate = createDto.endDate;
    tourGuide.isAvailable = createDto.isAvailable;
    tourGuide.bankAccountNumber = createDto.bankAccountNumber;
    tourGuide.bankName = createDto.bankName;
    tourGuide.bankAccountName = createDto.bankAccountName;
    tourGuide.createdBy = user.id;
    tourGuide.createdAt = new Date();

    await this.repo.insert(tourGuide);

    const avatarData = Array.isArray(createDto.avatar)
      ? createDto.avatar[0]
      : createDto.avatar;
    if (avatarData?.fileUrl && avatarData?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: avatarData.fileUrl,
        fileName: avatarData.fileName,
        fileType: 'TOUR_GUIDE_AVATAR',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'tourGuideId',
        fileRelationId: tourGuide.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const existingUser = await this.userRepo.findOne({
      where: { username: tourGuide.phone },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Lỗi hệ thống khi tạo hướng dẫn viên, vui lòng thử lại',
      );
    }

    const newUser = new UserEntity();
    newUser.id = uuidv4();
    newUser.username = tourGuide.phone;
    newUser.password = '123456';
    newUser.email = tourGuide.email;
    newUser.isActive = true;
    newUser.isAdmin = false;
    newUser.customerId = undefined;
    newUser.tourGuideId = tourGuide.id;
    newUser.createdBy = user.id;
    newUser.createdAt = new Date();
    await this.userRepo.insert(newUser);

    const actionLogDto: ActionLogCreateDto = {
      functionId: tourGuide.id,
      functionType: 'TourGuide',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới hướng dẫn viên: ${tourGuide.code}`,
      oldData: '{}',
      newData: JSON.stringify(tourGuide),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới hướng dẫn viên thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdateTourGuideDto) {
    const tourGuide = await this.repo.findOne({
      where: { id: updateDto.id },
      relations: { user: true },
    });

    if (!tourGuide) {
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');
    }

    const tourGuideUser = await tourGuide.user;
    if (!tourGuideUser) {
      throw new NotFoundException(
        'Không tìm thấy tài khoản liên kết với hướng dẫn viên',
      );
    }

    const dataCheck: Partial<CheckPhoneEmailTourGuideDto> = {};
    if (updateDto.phone && updateDto.phone !== tourGuide.phone) {
      dataCheck.phone = updateDto.phone;
    }
    if (updateDto.email && updateDto.email !== tourGuide.email) {
      dataCheck.email = updateDto.email;
    }

    if (Object.keys(dataCheck).length > 0) {
      await this.checkPhoneAndEmail(dataCheck, {
        tourGuideId: tourGuide.id,
      });
    }

    const oldTourGuideData = { ...tourGuide };
    const oldUserData = { ...tourGuideUser, password: '***' };

    const tourGuideUpdateData: Partial<TourGuideEntity> = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.name !== undefined) tourGuideUpdateData.name = updateDto.name;
    if (updateDto.phone !== undefined)
      tourGuideUpdateData.phone = updateDto.phone;
    let slugChanged = false;
    if (
      updateDto.name !== undefined &&
      updateDto.name.trim() !== tourGuide.name
    ) {
      tourGuide.name = updateDto.name.trim();
      const newSlug = coreHelper.generateSlug(tourGuide.name);
      const existing = await this.repo.findOne({
        where: { slug: newSlug, id: Not(tourGuide.id) },
      });

      tourGuide.slug = existing
        ? `${newSlug}-${customAlphabet('0123456789', 3)()}`
        : newSlug;

      slugChanged = true;
    }
    if (updateDto.email !== undefined)
      tourGuideUpdateData.email = updateDto.email;
    if (updateDto.address !== undefined)
      tourGuideUpdateData.address = updateDto.address;
    if (updateDto.gender !== undefined)
      tourGuideUpdateData.gender = updateDto.gender;
    if (updateDto.birthday !== undefined)
      tourGuideUpdateData.birthday = updateDto.birthday;
    if (updateDto.nationality !== undefined)
      tourGuideUpdateData.nationality = updateDto.nationality;
    if (updateDto.identityCard !== undefined)
      tourGuideUpdateData.identityCard = updateDto.identityCard;
    if (updateDto.passportNumber !== undefined)
      tourGuideUpdateData.passportNumber = updateDto.passportNumber;
    if (updateDto.shortBio !== undefined)
      tourGuideUpdateData.shortBio = updateDto.shortBio;
    if (updateDto.bio !== undefined) tourGuideUpdateData.bio = updateDto.bio;
    if (updateDto.languages !== undefined)
      tourGuideUpdateData.languages = updateDto.languages;
    if (updateDto.specialties !== undefined)
      tourGuideUpdateData.specialties = updateDto.specialties;
    if (updateDto.yearsOfExperience !== undefined)
      tourGuideUpdateData.yearsOfExperience = updateDto.yearsOfExperience;
    if (updateDto.licenseNumber !== undefined)
      tourGuideUpdateData.licenseNumber = updateDto.licenseNumber;
    if (updateDto.licenseIssuedDate !== undefined)
      tourGuideUpdateData.licenseIssuedDate = updateDto.licenseIssuedDate;
    if (updateDto.licenseExpiryDate !== undefined)
      tourGuideUpdateData.licenseExpiryDate = updateDto.licenseExpiryDate;
    if (updateDto.licenseIssuedBy !== undefined)
      tourGuideUpdateData.licenseIssuedBy = updateDto.licenseIssuedBy;
    if (updateDto.averageRating !== undefined)
      tourGuideUpdateData.averageRating = updateDto.averageRating;
    if (updateDto.totalReviews !== undefined)
      tourGuideUpdateData.totalReviews = updateDto.totalReviews;
    if (updateDto.totalToursCompleted !== undefined)
      tourGuideUpdateData.totalToursCompleted = updateDto.totalToursCompleted;
    if (updateDto.description !== undefined)
      tourGuideUpdateData.description = updateDto.description;
    if (updateDto.baseSalary !== undefined)
      tourGuideUpdateData.baseSalary = updateDto.baseSalary;
    if (updateDto.commissionRate !== undefined)
      tourGuideUpdateData.commissionRate = updateDto.commissionRate;
    if (updateDto.startDate !== undefined)
      tourGuideUpdateData.startDate = updateDto.startDate;
    if (updateDto.endDate !== undefined)
      tourGuideUpdateData.endDate = updateDto.endDate;
    if (updateDto.isAvailable !== undefined)
      tourGuideUpdateData.isAvailable = updateDto.isAvailable;
    if (updateDto.bankAccountNumber !== undefined)
      tourGuideUpdateData.bankAccountNumber = updateDto.bankAccountNumber;
    if (updateDto.bankName !== undefined)
      tourGuideUpdateData.bankName = updateDto.bankName;
    if (updateDto.bankAccountName !== undefined)
      tourGuideUpdateData.bankAccountName = updateDto.bankAccountName;

    if (updateDto.avatar !== undefined) {
      await this.fileArchivalRepo.delete({ tourGuideId: tourGuide.id });

      const avatarData = Array.isArray(updateDto.avatar)
        ? updateDto.avatar[0]
        : updateDto.avatar;
      if (avatarData?.fileUrl && avatarData?.fileName) {
        const fileArchival: FileArchivalCreateDto = {
          fileUrl: avatarData.fileUrl,
          fileName: avatarData.fileName,
          fileType: 'TOUR_GUIDE_AVATAR',
          createdBy: user.id,
          createdAt: new Date().toISOString(),
          fileRelationName: 'tourGuideId',
          fileRelationId: tourGuide.id,
        };
        await this.fileArchivalService.create(fileArchival);
      }
    }

    await this.repo.update(tourGuide.id, tourGuideUpdateData);
    const updatedTourGuide = await this.repo.findOne({
      where: { id: tourGuide.id },
      relations: { user: true },
    });

    const updatedUser = await updatedTourGuide?.user;

    const actionLogDto: ActionLogCreateDto = {
      functionId: tourGuide.id,
      functionType: 'TourGuide',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật thông tin hướng dẫn viên: ${tourGuide.code} - ${tourGuide.name || 'Unknown'}`,
      oldData: JSON.stringify({
        tourGuide: oldTourGuideData,
        user: oldUserData,
      }),
      newData: JSON.stringify({
        tourGuide: updatedTourGuide,
        user: updatedUser ? { ...updatedUser, password: '***' } : null,
      }),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật hướng dẫn viên thành công',
      data: transformKeys(updatedTourGuide),
    };
  }

  async deactivate(user: UserDto, id: string) {
    const tourGuide = await this.repo.findOne({ where: { id } });
    if (!tourGuide) {
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');
    }
    const tourGuideUsers = await this.userRepo.find({
      where: { tourGuideId: id },
    });

    for (const tourGuideUser of tourGuideUsers) {
      await this.userRepo.update(tourGuideUser.id, {
        isDeleted: true,
        isActive: false,
        updatedBy: user.id,
        updatedAt: new Date(),
      });
    }

    await this.repo.update(id, { isDeleted: true });
    if (tourGuideUsers.length) {
      await this.userRepo.update(
        { tourGuideId: id },
        {
          isDeleted: true,
          isActive: false,
        },
      );
    }
    const actionLogDto: ActionLogCreateDto = {
      functionId: tourGuide.id,
      functionType: 'TourGuide',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động hướng dẫn viên với code: ${tourGuide.code}`,
      oldData: JSON.stringify(tourGuide),
      newData: JSON.stringify({
        ...tourGuide,
        isDeleted: true,
        users: tourGuideUsers.map((u) => ({
          id: u.id,
          isDeleted: true,
          isActive: false,
        })),
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Ngừng hoạt động hướng dẫn viên thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const tourGuide = await this.repo.findOne({ where: { id } });
    if (!tourGuide) {
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');
    }
    await this.checkPhoneAndEmail(
      {
        phone: tourGuide.phone,
        email: tourGuide.email,
      },
      { tourGuideId: tourGuide.id, skipDuprValidation: true },
    );

    const tourGuideUsers = await this.userRepo.find({
      where: { tourGuideId: id },
    });

    await this.repo.update(id, { isDeleted: false });
    if (tourGuideUsers.length) {
      await this.userRepo.update(
        { tourGuideId: id },
        {
          isDeleted: false,
          isActive: true,
        },
      );
    }
    const actionLogDto: ActionLogCreateDto = {
      functionId: tourGuide.id,
      functionType: 'TourGuide',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt hướng dẫn viên với code: ${tourGuide.code}`,
      oldData: JSON.stringify(tourGuide),
      newData: JSON.stringify({
        ...tourGuide,
        isDeleted: false,
        users: tourGuideUsers.map((u) => ({
          id: u.id,
          isDeleted: false,
          isActive: true,
        })),
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt hướng dẫn viên thành công',
    };
  }

  async findByCodes(codes: string[]): Promise<TourGuideEntity[]> {
    return await this.repo.find({
      where: {
        code: In(codes),
        isDeleted: false,
      },
    });
  }

  async findByIds(ids: string[]): Promise<TourGuideEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }

  async findByPhones(phones: string[]): Promise<TourGuideEntity[]> {
    return await this.repo.find({
      where: {
        phone: In(phones),
        isDeleted: false,
      },
    });
  }

  async sendOtpVerifyTourGuide(data: SendOtpTourGuideDto) {
    const otpCode = this.generateOtpCode();
    const newOtp = new VerifyOtpEntity();
    newOtp.otpCode = otpCode;
    newOtp.sendMethod = data.sendMethod;

    const millisecondEffect =
      Number(process.env.MILLISECOND_OTP_EFFECT) || 300000;

    if (data.sendMethod === enumData.OTPSendMethod.ZALO) {
      const checkPhone = await this.repo.findOne({
        where: {
          phone: In([data.phone, coreHelper.normalizePhoneNumber(data.phone)]),
          isDeleted: false,
        },
      });
      if (!checkPhone) {
        throw new NotFoundException(
          'Số điện thoại không tồn tại trên hệ thống',
        );
      }
      if (checkPhone.isDeleted) {
        throw new NotFoundException('Số điện thoại đã bị khóa');
      }

      const res = await this.zaloService.sendOtpCode({
        phone: data.phone,
        otpCode,
      });
      newOtp.phone = data.phone;
      newOtp.dateExpired = new Date(new Date().getTime() + millisecondEffect);
      if (!res.isSuccess) {
        newOtp.error = JSON.stringify({ message: res.message, code: res.code });
      }
      await this.verifyRepo.insert(newOtp);
      return { ...res, tourGuideId: checkPhone.id };
    }

    if (data.sendMethod === enumData.OTPSendMethod.EMAIL) {
      const checkEmail = await this.repo.findOne({
        where: { email: data.email, isDeleted: false },
      });
      if (!checkEmail) {
        throw new NotFoundException('Email không tồn tại trên hệ thống');
      }
      if (checkEmail.isDeleted) {
        throw new NotFoundException('Email đã bị khóa');
      }

      await this.emailService.sendEmailForgotPassword({
        email: data.email,
        otpCode,
      });

      newOtp.email = data.email;
      newOtp.dateExpired = new Date(new Date().getTime() + millisecondEffect);
      await this.verifyRepo.insert(newOtp);

      return {
        isSuccess: true,
        tourGuideId: checkEmail.id,
        message: 'Mã OTP đã được gửi đến email của bạn',
      };
    }
    throw new NotFoundException(
      `Phương thức [${data.sendMethod}] không hợp lệ`,
    );
  }

  async verifyOtp(data: VerifyOtpDto) {
    await this.checkOtpCode({
      phone: data.phone,
      email: data.email,
      sendMethod: data.sendMethod,
      otpCode: data.otpCode,
    });

    let tourGuide: TourGuideEntity | null = null;
    if (data.sendMethod === enumData.OTPSendMethod.ZALO) {
      tourGuide = await this.repo.findOne({
        where: {
          phone: In([data.phone, coreHelper.normalizePhoneNumber(data.phone)]),
          isDeleted: false,
        },
      });
    } else if (data.sendMethod === enumData.OTPSendMethod.EMAIL) {
      tourGuide = await this.repo.findOne({
        where: {
          email: data.email,
          isDeleted: false,
        },
      });
    }

    if (!tourGuide) {
      throw new NotFoundException('Hướng dẫn viên không tồn tại');
    }

    await this.repo.update(tourGuide.id, {});
    return {
      message: 'Xác thực OTP thành công',
    };
  }

  async forgotPassword(data: ForgotPasswordTourGuideDto) {
    if (data.password !== data.confirmPassword) {
      throw new NotFoundException('Mật khẩu và xác nhận mật khẩu không khớp');
    }

    const foundCus = await this.repo.findOne({
      where: { id: data.tourGuideId },
    });
    if (!foundCus) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    if (foundCus.isDeleted) {
      throw new NotFoundException('Tài khoản đã bị khóa');
    }

    await this.checkOtpCode({
      sendMethod: data.sendMethod,
      phone: foundCus.phone,
      email: foundCus.email,
      otpCode: data.otpCode,
    });

    if (!data.password) {
      throw new NotFoundException('Mật khẩu không được để trống');
    }

    const foundUser = await this.userRepo.findOne({
      where: { tourGuideId: foundCus.id },
    });
    if (!foundUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    foundUser.password = data.password;
    await this.userRepo.save(foundUser);

    return {
      message: 'Đặt lại mật khẩu thành công',
    };
  }

  async changePassword(
    user: UserDto,
    id: string,
    changePasswordDto: ChangePasswordTourGuideDto,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Mật khẩu và xác nhận mật khẩu không khớp');
    }
    const tourGuide = await this.repo.findOne({ where: { id } });
    if (!tourGuide) {
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');
    }
    const tourGuideUser = await this.userRepo.findOne({
      where: { tourGuideId: id },
    });
    if (!tourGuideUser) {
      throw new NotFoundException('Không tìm thấy tài khoản hướng dẫn viên');
    }

    const oldUserData = JSON.stringify({ ...tourGuideUser, password: '***' });

    tourGuideUser.password = changePasswordDto.newPassword;
    tourGuideUser.updatedBy = user.id;
    tourGuideUser.updatedAt = new Date();

    await this.userRepo.save(tourGuideUser);
    const actionLogDto: ActionLogCreateDto = {
      functionId: tourGuide.id,
      functionType: 'TourGuide',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Thay đổi mật khẩu cho hướng dẫn viên: ${tourGuide.code} thành công`,
      oldData: JSON.stringify({ tourGuide, user: oldUserData }),
      newData: JSON.stringify({
        tourGuide,
        user: { ...tourGuideUser, password: '***' },
      }),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Thay đổi mật khẩu thành công',
    };
  }

  async updateAvatar(user: UserDto, data: UpdateTourGuideAvatarDto) {
    const checkTourGuide = await this.repo.findOne({
      where: { id: user.tourGuideId },
    });
    if (!checkTourGuide)
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');

    await this.fileArchivalRepo.delete({ tourGuideId: checkTourGuide.id });

    const fileArchival = new FileArchivalCreateDto();
    fileArchival.createdBy = user.id;
    fileArchival.fileUrl = data.avatarUrl;
    fileArchival.fileName = 'avatarUrl';
    fileArchival.fileRelationName = 'tourGuideId';
    fileArchival.fileRelationId = checkTourGuide.id;
    await this.fileArchivalService.create(fileArchival);

    return {
      message: 'Cập nhật ảnh đại diện thành công',
    };
  }

  async findAll(data: PaginationDto) {
    const [tourGuides, total] = await this.repo.findAndCount({
      where: { isDeleted: false },
      relations: {
        avatar: true,
      },

      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    const res = transformKeys(tourGuides);

    return {
      data: res,
      total,
    };
  }

  async exportExcel(): Promise<Buffer> {
    const tourGuides = await this.repo.find({
      where: { isDeleted: false },
      relations: { avatar: true },
      order: { createdAt: 'ASC' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'BookingTour System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Danh sách hướng dẫn viên', {
      pageSetup: { fitToPage: true, orientation: 'landscape' },
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    const COLUMNS: {
      header: string;
      key: string;
      width: number;
    }[] = [
      { header: 'STT', key: 'stt', width: 6 },
      { header: 'Mã HDV', key: 'code', width: 14 },
      { header: 'Họ tên', key: 'name', width: 28 },
      { header: 'Giới tính', key: 'gender', width: 12 },
      { header: 'Ngày sinh', key: 'birthday', width: 14 },
      { header: 'Số điện thoại', key: 'phone', width: 18 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Địa chỉ', key: 'address', width: 36 },
      { header: 'Quốc tịch', key: 'nationality', width: 14 },
      { header: 'Số CCCD/CMND', key: 'identityCard', width: 18 },
      { header: 'Số hộ chiếu', key: 'passportNumber', width: 18 },
      { header: 'Số chứng chỉ', key: 'licenseNumber', width: 18 },
      { header: 'Ngày cấp CC', key: 'licenseIssuedDate', width: 14 },
      { header: 'Ngày hết hạn CC', key: 'licenseExpiryDate', width: 16 },
      { header: 'Nơi cấp CC', key: 'licenseIssuedBy', width: 20 },
      { header: 'Kinh nghiệm (năm)', key: 'yearsOfExperience', width: 18 },
      { header: 'Lương cơ bản', key: 'baseSalary', width: 18 },
      { header: 'Hoa hồng (%)', key: 'commissionRate', width: 14 },
      { header: 'Số TK Ngân hàng', key: 'bankAccountNumber', width: 22 },
      { header: 'Tên ngân hàng', key: 'bankName', width: 20 },
      { header: 'Chủ tài khoản', key: 'bankAccountName', width: 24 },
      { header: 'Giới thiệu ngắn', key: 'shortBio', width: 40 },
      { header: 'Đánh giá TB', key: 'averageRating', width: 14 },
      { header: 'Tổng đánh giá', key: 'totalReviews', width: 14 },
      { header: 'Tour đã dẫn', key: 'totalToursCompleted', width: 14 },
      { header: 'Sẵn sàng nhận tour', key: 'isAvailable', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 14 },
    ];

    sheet.columns = COLUMNS;

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F4E79' },
      };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        right: { style: 'thin', color: { argb: 'FFBFBFBF' } },
      };
    });
    headerRow.height = 32;

    const formatDate = (d?: Date | null) =>
      d ? new Date(d).toLocaleDateString('vi-VN') : '';

    tourGuides.forEach((tg, index) => {
      const row = sheet.addRow({
        stt: index + 1,
        code: tg.code,
        name: tg.name,
        gender:
          tg.gender === 'MALE'
            ? 'Nam'
            : tg.gender === 'FEMALE'
              ? 'Nữ'
              : (tg.gender ?? ''),
        birthday: formatDate(tg.birthday),
        phone: tg.phone,
        email: tg.email,
        address: tg.address ?? '',
        nationality: tg.nationality ?? '',
        identityCard: tg.identityCard ?? '',
        passportNumber: tg.passportNumber ?? '',
        licenseNumber: tg.licenseNumber ?? '',
        licenseIssuedDate: formatDate(tg.licenseIssuedDate),
        licenseExpiryDate: formatDate(tg.licenseExpiryDate),
        licenseIssuedBy: tg.licenseIssuedBy ?? '',
        yearsOfExperience: tg.yearsOfExperience ?? '',
        baseSalary: tg.baseSalary ?? '',
        commissionRate: tg.commissionRate ?? '',
        bankAccountNumber: tg.bankAccountNumber ?? '',
        bankName: tg.bankName ?? '',
        bankAccountName: tg.bankAccountName ?? '',
        shortBio: tg.shortBio ?? '',
        averageRating: tg.averageRating ?? '',
        totalReviews: tg.totalReviews ?? '',
        totalToursCompleted: tg.totalToursCompleted ?? '',
        isAvailable: tg.isAvailable ? 'Sẵn sàng' : 'Không sẵn sàng',
        status: tg.isDeleted ? 'Đã khóa' : 'Đang hoạt động',
      });

      const fill: ExcelJS.Fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFD9E1F2' },
      };
      row.eachCell((cell) => {
        cell.fill = fill;
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFBFBFBF' } },
          left: { style: 'thin', color: { argb: 'FFBFBFBF' } },
          bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } },
          right: { style: 'thin', color: { argb: 'FFBFBFBF' } },
        };
      });
      row.height = 22;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  async importExcel(
    user: UserDto,
    fileBuffer: Buffer,
    fileMeta?: UploadedFileMeta,
  ): Promise<{
    message: string;
    total: number;
    success: number;
    failed: number;
    errors: { row: number; reason: string }[];
  }> {
    assertXlsxFile(fileMeta);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.from(fileBuffer) as any);

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      throw new BadRequestException(
        'File Excel không hợp lệ hoặc không có sheet dữ liệu',
      );
    }

    const normalizeHeader = (s: string) =>
      String(s ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    const HEADER_MAP: Record<string, keyof ImportTourGuideRowDto> = {
      [normalizeHeader('Họ và tên')]: 'name',
      [normalizeHeader('Họ tên')]: 'name',
      [normalizeHeader('Tên')]: 'name',
      [normalizeHeader('Số điện thoại')]: 'phone',
      [normalizeHeader('SĐT')]: 'phone',
      [normalizeHeader('Điện thoại')]: 'phone',
      [normalizeHeader('Phone')]: 'phone',
      [normalizeHeader('Email')]: 'email',
      [normalizeHeader('E-mail')]: 'email',
      [normalizeHeader('Địa chỉ')]: 'address',
      [normalizeHeader('Giới tính')]: 'gender',
      [normalizeHeader('Ngày sinh')]: 'birthday',
      [normalizeHeader('Quốc tịch')]: 'nationality',
      [normalizeHeader('Số CCCD/CMND')]: 'identityCard',
      [normalizeHeader('CCCD/CMND')]: 'identityCard',
      [normalizeHeader('Số hộ chiếu')]: 'passportNumber',
      [normalizeHeader('Số chứng chỉ')]: 'licenseNumber',
      [normalizeHeader('Ngày cấp CC')]: 'licenseIssuedDate',
      [normalizeHeader('Ngày hết hạn CC')]: 'licenseExpiryDate',
      [normalizeHeader('Nơi cấp CC')]: 'licenseIssuedBy',
      [normalizeHeader('Kinh nghiệm (năm)')]: 'yearsOfExperience',
      [normalizeHeader('Kinh nghiệm')]: 'yearsOfExperience',
      [normalizeHeader('Lương cơ bản')]: 'baseSalary',
      [normalizeHeader('Hoa hồng (%)')]: 'commissionRate',
      [normalizeHeader('Hoa hồng')]: 'commissionRate',
      [normalizeHeader('Số TK Ngân hàng')]: 'bankAccountNumber',
      [normalizeHeader('Số tài khoản')]: 'bankAccountNumber',
      [normalizeHeader('Tên ngân hàng')]: 'bankName',
      [normalizeHeader('Chủ tài khoản')]: 'bankAccountName',
      [normalizeHeader('Giới thiệu ngắn')]: 'shortBio',
    };

    let headerRowIndex = 1;
    for (let i = 1; i <= Math.min(10, sheet.rowCount); i++) {
      const r = sheet.getRow(i);
      const headersInRow = new Set<string>();
      r.eachCell((cell) => {
        const h = normalizeHeader(cell.text ?? '');
        if (h) headersInRow.add(h);
      });
      const hasName = headersInRow.has('Họ tên');
      const hasPhone = headersInRow.has('Số điện thoại');
      const hasEmail = headersInRow.has('Email');
      if (
        (hasName && hasPhone) ||
        (hasName && hasEmail) ||
        (hasPhone && hasEmail)
      ) {
        headerRowIndex = i;
        break;
      }
    }

    const headerRow = sheet.getRow(headerRowIndex);
    const debugHeaders: { col: number; raw: string }[] = [];
    headerRow.eachCell((cell, colNumber) => {
      const raw = normalizeHeader(cell.text ?? '');
      if (raw) debugHeaders.push({ col: colNumber, raw });
    });
    console.log('[TourGuide.importExcel] headerRowIndex:', headerRowIndex);
    console.log('[TourGuide.importExcel] headers:', debugHeaders);

    const colIndexMap = new Map<keyof ImportTourGuideRowDto, number>();
    headerRow.eachCell((cell, colNumber) => {
      const header = normalizeHeader(cell.text?.trim() ?? '');
      const field = HEADER_MAP[header];
      if (field) colIndexMap.set(field, colNumber);
    });
    console.log('[TourGuide.importExcel] colIndexMap:', {
      name: colIndexMap.get('name'),
      phone: colIndexMap.get('phone'),
      email: colIndexMap.get('email'),
    });

    if (
      !colIndexMap.get('name') ||
      !colIndexMap.get('phone') ||
      !colIndexMap.get('email')
    ) {
      console.warn('[TourGuide.importExcel] Missing required headers.', {
        headerRowIndex,
        headers: debugHeaders,
        colIndexMap: {
          name: colIndexMap.get('name'),
          phone: colIndexMap.get('phone'),
          email: colIndexMap.get('email'),
        },
      });
      throw new BadRequestException(
        'Không nhận diện được cột bắt buộc (Họ tên / Số điện thoại / Email). Vui lòng kiểm tra header file Excel.',
      );
    }

    const getCellRaw = (
      row: ExcelJS.Row,
      field: keyof ImportTourGuideRowDto,
    ) => {
      const col = colIndexMap.get(field);
      if (!col) return undefined;
      const val = row.getCell(col).value;
      if (val === null || val === undefined || val === '') return undefined;
      return val;
    };

    const getCellText = (
      row: ExcelJS.Row,
      field: keyof ImportTourGuideRowDto,
    ) => {
      const col = colIndexMap.get(field);
      if (!col) return undefined;
      const text = row.getCell(col).text?.trim();
      if (!text) return undefined;
      return text;
    };

    const parseDate = (val: any): Date | undefined => {
      if (!val) return undefined;
      if (val instanceof Date) return val;
      if (typeof val === 'number') {
        const d = new Date((val - 25569) * 86400 * 1000);
        return isNaN(d.getTime()) ? undefined : d;
      }
      const d = new Date(String(val));
      return isNaN(d.getTime()) ? undefined : d;
    };

    const parseGender = (val: any): string | undefined => {
      if (!val) return undefined;
      const v = String(val).trim().toLowerCase();
      if (v === 'nam' || v === 'male') return 'MALE';
      if (v === 'nữ' || v === 'nu' || v === 'female') return 'FEMALE';
      return String(val).trim();
    };

    const parseNumber = (val: any): number | undefined => {
      if (val === null || val === undefined || val === '') return undefined;
      const n = typeof val === 'number' ? val : Number(String(val).trim());
      return Number.isFinite(n) ? n : undefined;
    };

    const errors: { row: number; reason: string }[] = [];
    let success = 0;
    let failed = 0;
    let totalDataRows = 0;

    const dataStartRow = headerRowIndex + 1;
    for (
      let rowNumber = dataStartRow;
      rowNumber <= sheet.rowCount;
      rowNumber++
    ) {
      const row = sheet.getRow(rowNumber);

      const isEmptyRow = !row.hasValues;
      if (isEmptyRow) continue;
      totalDataRows++;

      const name = getCellText(row, 'name') ?? '';
      const phone = getCellText(row, 'phone') ?? '';
      const email = getCellText(row, 'email') ?? '';

      if (!name || !phone || !email) {
        failed++;
        errors.push({
          row: rowNumber,
          reason:
            `Thiếu thông tin bắt buộc: ${!name ? 'Họ tên' : ''} ${!phone ? 'Số điện thoại' : ''} ${!email ? 'Email' : ''}`
              .replace(/\s+/g, ' ')
              .trim(),
        });
        continue;
      }

      try {
        await this.checkPhoneAndEmail({ phone, email });
      } catch (err: any) {
        failed++;
        errors.push({ row: rowNumber, reason: err.message });
        continue;
      }

      try {
        const tourGuide = new TourGuideEntity();
        tourGuide.id = uuidv4();
        tourGuide.code = this.genCodeTourGuide();
        tourGuide.name = name;
        tourGuide.phone = phone;
        tourGuide.email = email;
        tourGuide.slug = coreHelper.generateSlug(name);

        const existing = await this.repo.findOne({
          where: { slug: tourGuide.slug },
        });
        if (existing) {
          tourGuide.slug = `${tourGuide.slug}-${customAlphabet('0123456789', 4)()}`;
        }

        tourGuide.gender = parseGender(getCellText(row, 'gender'));
        tourGuide.birthday =
          parseDate(getCellRaw(row, 'birthday')) ?? new Date();
        tourGuide.address = getCellText(row, 'address') || undefined;
        tourGuide.nationality = getCellText(row, 'nationality') || undefined;
        tourGuide.identityCard = getCellText(row, 'identityCard') || undefined;
        tourGuide.passportNumber =
          getCellText(row, 'passportNumber') || undefined;
        tourGuide.licenseNumber =
          getCellText(row, 'licenseNumber') || undefined;
        tourGuide.licenseIssuedDate = parseDate(
          getCellRaw(row, 'licenseIssuedDate'),
        );
        tourGuide.licenseExpiryDate = parseDate(
          getCellRaw(row, 'licenseExpiryDate'),
        );
        tourGuide.licenseIssuedBy =
          getCellText(row, 'licenseIssuedBy') || undefined;
        tourGuide.yearsOfExperience = parseNumber(
          getCellRaw(row, 'yearsOfExperience'),
        );
        tourGuide.baseSalary = parseNumber(getCellRaw(row, 'baseSalary'));
        tourGuide.commissionRate = parseNumber(
          getCellRaw(row, 'commissionRate'),
        );
        tourGuide.bankAccountNumber =
          getCellText(row, 'bankAccountNumber') || undefined;
        tourGuide.bankName = getCellText(row, 'bankName') || undefined;
        tourGuide.bankAccountName =
          getCellText(row, 'bankAccountName') || undefined;
        tourGuide.shortBio = getCellText(row, 'shortBio') || undefined;
        tourGuide.isAvailable = true;
        tourGuide.createdBy = user.id;
        tourGuide.createdAt = new Date();

        await this.repo.insert(tourGuide);
        const newUser = new UserEntity();
        newUser.id = uuidv4();
        newUser.username = tourGuide.phone;
        newUser.password = '123456';
        newUser.email = tourGuide.email;
        newUser.isActive = true;
        newUser.isAdmin = false;
        newUser.tourGuideId = tourGuide.id;
        newUser.createdBy = user.id;
        newUser.createdAt = new Date();
        await this.userRepo.insert(newUser);

        success++;
      } catch (err: any) {
        failed++;
        errors.push({
          row: rowNumber,
          reason: err?.message ?? 'Lỗi không xác định',
        });
      }
    }

    return {
      message: `Import hoàn tất: ${success}/${totalDataRows} thành công`,
      total: totalDataRows,
      success,
      failed,
      errors,
    };
  }
}
