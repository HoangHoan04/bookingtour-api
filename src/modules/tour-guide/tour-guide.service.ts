import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { enumData } from 'src/common/constants';
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
    tourGuide.email = createDto.email;
    tourGuide.address = '';
    tourGuide.gender = createDto.gender || 'MALE';
    tourGuide.birthday = new Date();
    tourGuide.nationality = 'VN';
    tourGuide.identityCard = '';
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
    const tourGuide = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!tourGuide) {
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');
    }

    const tourGuideUser = await this.userRepo.findOne({
      where: { tourGuideId: updateDto.id },
    });
    if (!tourGuideUser) {
      throw new NotFoundException('Không tìm thấy tài khoản hướng dẫn viên');
    }

    const dataCheck: Partial<CheckPhoneEmailTourGuideDto> = {};
    if (updateDto.phone !== tourGuide.phone) dataCheck.phone = updateDto.phone;
    if (updateDto.email !== tourGuide.email) dataCheck.email = updateDto.email;

    if (dataCheck.phone || dataCheck.email) {
      await this.checkPhoneAndEmail(dataCheck, {
        tourGuideId: tourGuide.id,
      });
    }

    const oldTourGuideData = JSON.stringify(tourGuide);
    const oldUserData = JSON.stringify({ ...tourGuideUser, password: '***' });

    const tourGuideUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.name) tourGuideUpdateData.name = updateDto.name;
    if (updateDto.phone) tourGuideUpdateData.phone = updateDto.phone;
    if (updateDto.email !== undefined)
      tourGuideUpdateData.email = updateDto.email;
    if (updateDto.gender) tourGuideUpdateData.gender = updateDto.gender;

    if (Object.prototype.hasOwnProperty.call(updateDto, 'avatar')) {
      await this.fileArchivalRepo.delete({ tourGuideId: updateDto.id });

      const avatarData = Array.isArray(updateDto.avatar)
        ? updateDto.avatar[0]
        : updateDto.avatar;
      if (avatarData?.fileUrl && avatarData?.fileName) {
        const fileArchival = new FileArchivalCreateDto();
        fileArchival.createdBy = user.id;
        fileArchival.fileUrl = avatarData.fileUrl;
        fileArchival.fileName = avatarData.fileName;
        fileArchival.fileRelationName = 'tourGuideId';
        fileArchival.fileRelationId = tourGuide.id;
        await this.fileArchivalService.create(fileArchival);
      }
    }

    await this.repo.update(tourGuide.id, tourGuideUpdateData);

    const updatedTourGuide = await this.repo.findOne({
      where: { id: tourGuide.id },
    });
    const updatedUser = await this.userRepo.findOne({
      where: { id: tourGuideUser.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: tourGuide.id,
      functionType: 'TourGuide',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật hướng dẫn viên: ${tourGuide.code} - ${tourGuide.name}`,
      oldData: JSON.stringify({
        tourGuide: oldTourGuideData,
        user: oldUserData,
      }),
      newData: JSON.stringify({
        tourGuide: updatedTourGuide,
        user: { ...updatedUser, password: '***' },
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật hướng dẫn viên thành công',
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
}
