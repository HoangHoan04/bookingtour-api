import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { enumData } from 'src/common/constants';
import { PaginationDto } from 'src/dto/pagination.dto';
import { UserDto } from 'src/dto/user.dto';
import { UserEntity } from 'src/entities';
import { VerifyOtpEntity } from 'src/entities/user';
import { CustomerEntity } from 'src/entities/user/customer.entity';
import { coreHelper, transformKeys } from 'src/helpers';
import { ActionLogService } from 'src/modules/actionLog/actionLog.service';
import { ActionLogCreateDto } from 'src/modules/actionLog/dto';
import { EmailService } from 'src/modules/email/email.service';
import { ZaloService } from 'src/modules/zalo/zalo.service';
import {
  CustomerRepository,
  UserRepository,
  VerifyOtpRepository,
} from 'src/repositories';
import { FileArchivalRepository } from 'src/repositories/base.repository';
import { FindOptionsWhere, ILike, In, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { FileArchivalCreateDto } from '../file-archival/dto';
import { FileArchivalService } from '../file-archival/file-archival.service';
import {
  ChangePasswordCustomerDto,
  CheckPhoneEmailCustomerDto,
  CreateCustomerDto,
  ForgotPasswordCustomerDto,
  RegisterCustomerDto,
  SendOtpCustomerDto,
  VerifyOtpDto,
} from './dto';
import {
  UpdateCustomerAvatarDto,
  UpdateCustomerDto,
} from './dto/updateCustomer.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly repo: CustomerRepository,
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

  private genCodeCustomer() {
    const generate = customAlphabet('0123456789', 8);
    return `KH${generate()}`;
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
      throw new NotFoundException('Không tìm thấy khách hàng');
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
      message: 'Tìm kiếm khách hàng thành công',
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
    if (res?.length !== 0 && res[0].id === user.customerId) {
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
    data: CheckPhoneEmailCustomerDto,
    options?: { customerId?: string; skipDuprValidation?: boolean },
  ) {
    let customer: CustomerEntity | null = null;
    if (options?.customerId) {
      customer = await this.repo.findOne({
        where: { id: options?.customerId },
        select: { id: true, phone: true, email: true },
      });
    }
    if (data.phone) {
      const phoneWhere: FindOptionsWhere<CustomerEntity> = {
        phone: In([data.phone, coreHelper.normalizePhoneNumber(data.phone)]),
        isDeleted: false,
      };
      if (options?.customerId) {
        phoneWhere.id = Not(options.customerId);
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

    if (data.email && (!customer || customer.email != data.email)) {
      const emailWhere: FindOptionsWhere<CustomerEntity> = {
        email: data.email,
        isDeleted: false,
      };
      if (options?.customerId) {
        emailWhere.id = Not(options.customerId);
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
    const whereCon: FindOptionsWhere<CustomerEntity> = {};

    if (data.where.code) whereCon.code = ILike(`%${data.where.code}%`);
    if (data.where.name) whereCon.name = ILike(`%${data.where.name}%`);
    if (data.where.phone) whereCon.phone = ILike(`%${data.where.phone}%`);
    if ([true, false].includes(data.where.isDeleted))
      whereCon.isDeleted = data.where.isDeleted;

    const [customers, total] = await this.repo.findAndCount({
      where: whereCon,
      skip: data.skip,
      take: data.take,
      order: { createdAt: 'DESC' },
    });

    return {
      data: customers,
      total,
    };
  }

  async create(user: UserDto, createDto: CreateCustomerDto) {
    await this.checkPhoneAndEmail({
      phone: createDto.phone,
      email: createDto.email,
    });

    const customer = new CustomerEntity();
    customer.id = uuidv4();
    customer.code = this.genCodeCustomer();
    customer.name = createDto.name;
    customer.phone = createDto.phone;
    customer.gender = createDto.gender;
    customer.email = createDto.email;
    customer.address = createDto.address;
    customer.birthday = createDto.birthday;
    customer.nationality = createDto.nationality;
    customer.identityCard = createDto.identityCard;
    customer.passportNumber = createDto.passportNumber;
    customer.description = createDto.description;
    customer.createdBy = user.id;
    customer.createdAt = new Date();

    await this.repo.insert(customer);

    const avatarData = Array.isArray(createDto.avatar)
      ? createDto.avatar[0]
      : createDto.avatar;
    if (avatarData?.fileUrl && avatarData?.fileName) {
      const fileArchival: FileArchivalCreateDto = {
        fileUrl: avatarData.fileUrl,
        fileName: avatarData.fileName,
        fileType: 'CUSTOMER_AVATAR',
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        fileRelationName: 'customerId',
        fileRelationId: customer.id,
      };
      await this.fileArchivalService.create(fileArchival);
    }

    const existingUser = await this.userRepo.findOne({
      where: { username: customer.phone },
    });
    if (existingUser) {
      throw new BadRequestException(
        'Lỗi hệ thống khi tạo khách hàng, vui lòng thử lại',
      );
    }

    const newUser = new UserEntity();
    newUser.id = uuidv4();
    newUser.username = customer.phone;
    newUser.password = '123456';
    newUser.email = customer.email;
    newUser.isActive = true;
    newUser.isAdmin = false;
    newUser.customerId = customer.id;
    newUser.tourGuideId = undefined;
    newUser.createdBy = user.id;
    newUser.createdAt = new Date();
    await this.userRepo.insert(newUser);

    const actionLogDto: ActionLogCreateDto = {
      functionId: customer.id,
      functionType: 'Customer',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Tạo mới khách hàng: ${customer.code}`,
      oldData: '{}',
      newData: JSON.stringify(customer),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Tạo mới khách hàng thành công',
    };
  }

  async register(data: RegisterCustomerDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException('Mật khẩu và xác nhận mật khẩu không khớp');
    }
    await this.checkPhoneAndEmail({ phone: data.phone, email: data.email });
    await this.checkOtpCode({
      phone: data.phone,
      email: data.email,
      sendMethod: data.sendMethod,
      otpCode: data.otpCode,
    });
    const customer = new CustomerEntity();
    customer.id = uuidv4();
    customer.code = this.genCodeCustomer();
    customer.name = data.name;
    customer.phone = data.phone;
    customer.email = data.email;
    customer.address = '';
    customer.gender = data.gender || 'MALE';
    customer.birthday = new Date();
    customer.nationality = undefined;
    customer.identityCard = undefined;
    customer.passportNumber = undefined;
    customer.createdBy = customer.id;
    customer.createdAt = new Date();
    await this.repo.insert(customer);

    const newUser = new UserEntity();
    newUser.id = uuidv4();
    newUser.username = customer.phone;
    newUser.password = data.password;
    newUser.email = customer.email;
    newUser.isActive = true;
    newUser.isAdmin = false;
    newUser.customerId = customer.id;
    newUser.tourGuideId = undefined;
    newUser.isVerified = true;
    newUser.createdBy = newUser.id;
    newUser.createdAt = new Date();

    await this.userRepo.insert(newUser);

    const actionLogDto: ActionLogCreateDto = {
      functionId: customer.id,
      functionType: 'Customer',
      type: enumData.ActionLogType.CREATE.code,
      createdBy: newUser.id,
      createdById: newUser.id,
      createdByName: newUser.username,
      description: `Khách hàng đăng ký tài khoản: ${customer.code}`,
      oldData: '{}',
      newData: JSON.stringify(customer),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Đăng ký tài khoản khách hàng thành công',
    };
  }

  async update(user: UserDto, updateDto: UpdateCustomerDto) {
    const customer = await this.repo.findOne({ where: { id: updateDto.id } });
    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }

    const customerUser = await this.userRepo.findOne({
      where: { customerId: updateDto.id },
    });
    if (!customerUser) {
      throw new NotFoundException('Không tìm thấy tài khoản khách hàng');
    }

    const dataCheck: Partial<CheckPhoneEmailCustomerDto> = {};
    if (updateDto.phone !== customer.phone) dataCheck.phone = updateDto.phone;
    if (updateDto.email !== customer.email) dataCheck.email = updateDto.email;

    if (dataCheck.phone || dataCheck.email) {
      await this.checkPhoneAndEmail(dataCheck as CheckPhoneEmailCustomerDto, {
        customerId: customer.id,
      });
    }

    const oldCustomerData = JSON.stringify(customer);
    const oldUserData = JSON.stringify({ ...customerUser, password: '***' });

    const customerUpdateData: any = {
      updatedBy: user.id,
      updatedAt: new Date(),
    };

    if (updateDto.name) customerUpdateData.name = updateDto.name;
    if (updateDto.phone) customerUpdateData.phone = updateDto.phone;
    if (updateDto.gender) customerUpdateData.gender = updateDto.gender;
    if (updateDto.email !== undefined)
      customerUpdateData.email = updateDto.email;
    if (updateDto.address !== undefined)
      customerUpdateData.address = updateDto.address;
    if (updateDto.birthday) customerUpdateData.birthday = updateDto.birthday;
    if (updateDto.nationality !== undefined)
      customerUpdateData.nationality = updateDto.nationality;
    if (updateDto.identityCard !== undefined)
      customerUpdateData.identityCard = updateDto.identityCard;
    if (updateDto.passportNumber !== undefined)
      customerUpdateData.passportNumber = updateDto.passportNumber;
    if (updateDto.description !== undefined)
      customerUpdateData.description = updateDto.description;

    if (Object.prototype.hasOwnProperty.call(updateDto, 'avatar')) {
      await this.fileArchivalRepo.delete({ customerId: updateDto.id });

      const avatarData = Array.isArray(updateDto.avatar)
        ? updateDto.avatar[0]
        : updateDto.avatar;
      if (avatarData?.fileUrl && avatarData?.fileName) {
        const fileArchival = new FileArchivalCreateDto();
        fileArchival.createdBy = user.id;
        fileArchival.fileUrl = avatarData.fileUrl;
        fileArchival.fileName = avatarData.fileName;
        fileArchival.fileRelationName = 'customerId';
        fileArchival.fileRelationId = customer.id;
        await this.fileArchivalService.create(fileArchival);
      }
    }

    await this.repo.update(customer.id, customerUpdateData);

    const updatedCustomer = await this.repo.findOne({
      where: { id: customer.id },
    });
    const updatedUser = await this.userRepo.findOne({
      where: { id: customerUser.id },
    });

    const actionLogDto: ActionLogCreateDto = {
      functionId: customer.id,
      functionType: 'Customer',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Cập nhật khách hàng: ${customer.code} - ${customer.name}`,
      oldData: JSON.stringify({ customer: oldCustomerData, user: oldUserData }),
      newData: JSON.stringify({
        customer: updatedCustomer,
        user: { ...updatedUser, password: '***' },
      }),
    };
    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Cập nhật khách hàng thành công',
    };
  }

  async deactivate(user: UserDto, id: string) {
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }
    const customerUsers = await this.userRepo.find({
      where: { customerId: id },
    });

    for (const customerUser of customerUsers) {
      await this.userRepo.update(customerUser.id, {
        isDeleted: true,
        isActive: false,
        updatedBy: user.id,
        updatedAt: new Date(),
      });
    }

    await this.repo.update(id, { isDeleted: true });
    if (customerUsers.length) {
      await this.userRepo.update(
        { customerId: id },
        {
          isDeleted: true,
          isActive: false,
        },
      );
    }
    const actionLogDto: ActionLogCreateDto = {
      functionId: customer.id,
      functionType: 'Customer',
      type: enumData.ActionLogType.DEACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Ngừng hoạt động khách hàng với code: ${customer.code}`,
      oldData: JSON.stringify(customer),
      newData: JSON.stringify({
        ...customer,
        isDeleted: true,
        users: customerUsers.map((u) => ({
          id: u.id,
          isDeleted: true,
          isActive: false,
        })),
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Ngừng hoạt động khách hàng thành công',
    };
  }

  async activate(user: UserDto, id: string) {
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }
    await this.checkPhoneAndEmail(
      {
        phone: customer.phone,
        email: customer.email,
      },
      { customerId: customer.id, skipDuprValidation: true },
    );

    const customerUsers = await this.userRepo.find({
      where: { customerId: id },
    });

    await this.repo.update(id, { isDeleted: false });
    if (customerUsers.length) {
      await this.userRepo.update(
        { customerId: id },
        {
          isDeleted: false,
          isActive: true,
        },
      );
    }
    const actionLogDto: ActionLogCreateDto = {
      functionId: customer.id,
      functionType: 'Customer',
      type: enumData.ActionLogType.ACTIVATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Kích hoạt khách hàng với code: ${customer.code}`,
      oldData: JSON.stringify(customer),
      newData: JSON.stringify({
        ...customer,
        isDeleted: false,
        users: customerUsers.map((u) => ({
          id: u.id,
          isDeleted: false,
          isActive: true,
        })),
      }),
    };
    await this.actionLogService.create(actionLogDto);
    return {
      message: 'Kích hoạt khách hàng thành công',
    };
  }

  async findByCodes(codes: string[]): Promise<CustomerEntity[]> {
    return await this.repo.find({
      where: {
        code: In(codes),
        isDeleted: false,
      },
    });
  }

  async findByIds(ids: string[]): Promise<CustomerEntity[]> {
    return await this.repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }

  async findByPhones(phones: string[]): Promise<CustomerEntity[]> {
    return await this.repo.find({
      where: {
        phone: In(phones),
        isDeleted: false,
      },
    });
  }

  async sendOtpVerifyCustomer(data: SendOtpCustomerDto) {
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
      return { ...res, customerId: checkPhone.id };
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
        customerId: checkEmail.id,
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

    let customer: CustomerEntity | null = null;
    if (data.sendMethod === enumData.OTPSendMethod.ZALO) {
      customer = await this.repo.findOne({
        where: {
          phone: In([data.phone, coreHelper.normalizePhoneNumber(data.phone)]),
          isDeleted: false,
        },
      });
    } else if (data.sendMethod === enumData.OTPSendMethod.EMAIL) {
      customer = await this.repo.findOne({
        where: {
          email: data.email,
          isDeleted: false,
        },
      });
    }

    if (!customer) {
      throw new NotFoundException('Khách hàng không tồn tại');
    }

    await this.repo.update(customer.id, {});
    return {
      message: 'Xác thực OTP thành công',
    };
  }

  async sendOtpRegisterCustomer(data: SendOtpCustomerDto) {
    await this.checkPhoneAndEmail({ phone: data.phone, email: data.email });

    const otpCode = this.generateOtpCode();
    const newOtp = new VerifyOtpEntity();
    newOtp.otpCode = otpCode;
    newOtp.sendMethod = data.sendMethod;

    const millisecondEffect =
      Number(process.env.MILLISECOND_OTP_EFFECT) || 300000;

    if (data.sendMethod === enumData.OTPSendMethod.ZALO) {
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
      return res;
    }

    if (data.sendMethod === enumData.OTPSendMethod.EMAIL) {
      await this.emailService.sendEmailVerify({ email: data.email, otpCode });
      newOtp.email = data.email;
      newOtp.dateExpired = new Date(new Date().getTime() + millisecondEffect);
      await this.verifyRepo.insert(newOtp);
      return {
        isSuccess: true,
        message: 'Gửi OTP thành công',
      };
    }
    throw new NotFoundException(
      `Phương thức [${data.sendMethod}] không hợp lệ`,
    );
  }

  async forgotPassword(data: ForgotPasswordCustomerDto) {
    if (data.password !== data.confirmPassword) {
      throw new NotFoundException('Mật khẩu và xác nhận mật khẩu không khớp');
    }

    const foundCus = await this.repo.findOne({
      where: { id: data.customerId },
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
      where: { customerId: foundCus.id },
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
    changePasswordDto: ChangePasswordCustomerDto,
  ) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('Mật khẩu và xác nhận mật khẩu không khớp');
    }
    const customer = await this.repo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }
    const customerUser = await this.userRepo.findOne({
      where: { customerId: id },
    });
    if (!customerUser) {
      throw new NotFoundException('Không tìm thấy tài khoản khách hàng');
    }

    const oldUserData = JSON.stringify({ ...customerUser, password: '***' });

    customerUser.password = changePasswordDto.newPassword;
    customerUser.updatedBy = user.id;
    customerUser.updatedAt = new Date();

    await this.userRepo.save(customerUser);
    const actionLogDto: ActionLogCreateDto = {
      functionId: customer.id,
      functionType: 'Customer',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: user.id,
      createdById: user.id,
      createdByName: user.username,
      description: `Thay đổi mật khẩu cho khách hàng: ${customer.code} thành công`,
      oldData: JSON.stringify({ customer, user: oldUserData }),
      newData: JSON.stringify({
        customer,
        user: { ...customerUser, password: '***' },
      }),
    };

    await this.actionLogService.create(actionLogDto);

    return {
      message: 'Thay đổi mật khẩu thành công',
    };
  }

  async updateAvatar(user: UserDto, data: UpdateCustomerAvatarDto) {
    const checkCustomer = await this.repo.findOne({
      where: { id: user.customerId },
    });
    if (!checkCustomer)
      throw new NotFoundException('Không tìm thấy khách hàng');

    await this.fileArchivalRepo.delete({ customerId: checkCustomer.id });

    const fileArchival = new FileArchivalCreateDto();
    fileArchival.createdBy = user.id;
    fileArchival.fileUrl = data.avatarUrl;
    fileArchival.fileName = 'avatarUrl';
    fileArchival.fileRelationName = 'customerId';
    fileArchival.fileRelationId = checkCustomer.id;
    await this.fileArchivalService.create(fileArchival);

    return {
      message: 'Cập nhật ảnh đại diện thành công',
    };
  }
}
