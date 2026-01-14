import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyOtpEntity } from 'src/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class OtpService {
  private readonly OTP_EXPIRY_MINUTES = 5;

  constructor(
    @InjectRepository(VerifyOtpEntity)
    private readonly otpRepo: Repository<VerifyOtpEntity>,
  ) {}

  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(identifier: string, method: string): Promise<string> {
    const otpCode = this.generateOtpCode();
    const dateExpired = new Date();
    dateExpired.setMinutes(dateExpired.getMinutes() + this.OTP_EXPIRY_MINUTES);

    const otp = this.otpRepo.create({
      otpCode,
      [method === 'EMAIL' ? 'email' : 'phone']: identifier,
      sendMethod: method,
      dateExpired,
    });

    await this.otpRepo.save(otp);
    return otpCode;
  }

  async verifyOtp(
    identifier: string,
    otpCode: string,
    method: string,
  ): Promise<boolean> {
    const whereClause =
      method === 'EMAIL'
        ? { email: identifier, sendMethod: method }
        : { phone: identifier, sendMethod: method };

    const otp = await this.otpRepo.findOne({
      where: whereClause,
      order: { createdDate: 'DESC' },
    });

    if (!otp) {
      throw new BadRequestException('Mã OTP không tồn tại');
    }

    if (new Date() > otp.dateExpired) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }

    if (otp.otpCode !== otpCode) {
      throw new BadRequestException('Mã OTP không chính xác');
    }

    if (otp.id) {
      await this.otpRepo.delete({ id: otp.id });
    }
    return true;
  }
}
