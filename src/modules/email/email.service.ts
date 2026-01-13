import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private senderAddress: string;

  constructor(private readonly configService: ConfigService) {
    const emailAccount =
      this.configService.get<string>('EMAIL_VALIDATE_ACCOUNT') || '';
    const emailPassword =
      this.configService.get<string>('EMAIL_VALIDATE_PASSWORD') || '';

    if (!emailAccount || !emailPassword) {
      throw new InternalServerErrorException(
        'Thiếu cấu hình EMAIL_VALIDATE_ACCOUNT hoặc EMAIL_VALIDATE_PASSWORD',
      );
    }

    this.senderAddress = emailAccount;
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailAccount,
        pass: emailPassword,
      },
    });
  }

  async sendEmailVerify(data: {
    email?: string;
    otpCode: string;
  }): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"NoahShop" <${this.senderAddress}>`,
        to: data.email,
        subject: 'Mã xác thực OTP - NoahShop',
        html: this.getOtpEmailTemplate(data.otpCode),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new InternalServerErrorException('Không thể gửi email xác thực');
    }
  }

  async sendEmailForgotPassword(data: {
    email?: string;
    otpCode: string;
  }): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"NoahShop" <${this.senderAddress}>`,
        to: data.email,
        subject: 'Khôi phục mật khẩu - NoahShop',
        html: this.getForgotPasswordTemplate(data.otpCode),
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw new InternalServerErrorException(
        'Không thể gửi email khôi phục mật khẩu',
      );
    }
  }

  private getOtpEmailTemplate(otpCode: string): string {
    const currentYear = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác thực tài khoản NoahShop</title>
        <style>
          body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        </style>
      </head>
      <body style="background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <div style="text-align: center; padding: 30px 0; background-color: #ffffff;">
             <img src="https://via.placeholder.com/150x40?text=NoahShop" alt="NoahShop Logo" style="width: 120px; height: auto;">
          </div>

          <div style="background: linear-gradient(120deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0; margin: 0 20px;">
            <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px auto; line-height: 60px;">
              <span style="font-size: 30px;">✨</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Xác thực tài khoản</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 10px;">Chào mừng bạn đến với NoahShop</p>
          </div>

          <div style="padding: 40px 30px; margin: 0 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 20px 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
              Xin chào,<br>Để hoàn tất quá trình đăng ký và bảo mật tài khoản, vui lòng nhập mã xác thực (OTP) dưới đây:
            </p>

            <div style="background-color: #f9fafb; border: 2px dashed #4f46e5; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
              <span style="display: block; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Mã xác thực của bạn</span>
              <div style="color: #4f46e5; font-size: 38px; font-weight: 800; letter-spacing: 12px; font-family: monospace;">${otpCode}</div>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; padding: 15px; margin-top: 25px;">
              <tr>
                <td width="30" valign="top" style="font-size: 20px; padding-right: 10px;">🛡️</td>
                <td>
                  <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
                    <strong>Lưu ý bảo mật:</strong> Mã này sẽ hết hạn sau <strong>5 phút</strong>. Tuyệt đối không chia sẻ mã này với bất kỳ ai, kể cả nhân viên NoahShop.
                  </p>
                </td>
              </tr>
            </table>

            <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
              Trân trọng,<br>
              <strong style="color: #4b5563;">Đội ngũ NoahShop</strong>
            </p>
          </div>

          <div style="padding: 30px 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin-bottom: 10px;">
              Bạn nhận được email này vì đã yêu cầu đăng ký tại NoahShop.
            </p>
            
            <div style="margin: 20px 0; border-top: 1px solid #e5e7eb; width: 100%;"></div>

            <p style="color: #6b7280; font-size: 12px; line-height: 1.6;">
              <strong>CÔNG TY TNHH NOAHSHOP VIỆT NAM</strong><br>
              🏢 Tầng 12, Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh<br>
              📞 Hotline: 1900 123 456 | 📧 Email: support@noahshop.com<br>
              🌐 Website: <a href="https://noahshop.com" style="color: #4f46e5; text-decoration: none;">www.noahshop.com</a>
            </p>
            
            <div style="margin-top: 15px;">
              <a href="#" style="margin: 0 5px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="20" alt="Facebook">
              </a>
              <a href="#" style="margin: 0 5px; text-decoration: none;">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" alt="Instagram">
              </a>
            </div>

            <p style="color: #d1d5db; font-size: 11px; margin-top: 20px;">
              © ${currentYear} NoahShop. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }

  private getForgotPasswordTemplate(otpCode: string): string {
    const currentYear = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Khôi phục mật khẩu NoahShop</title>
        <style>
          body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        </style>
      </head>
      <body style="background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          
          <div style="text-align: center; padding: 30px 0; background-color: #ffffff;">
             <img src="https://via.placeholder.com/150x40?text=NoahShop" alt="NoahShop Logo" style="width: 120px; height: auto;">
          </div>

          <div style="background: linear-gradient(135deg, #ef4444 0%, #f43f5e 100%); padding: 40px 20px; text-align: center; border-radius: 20px 20px 0 0; margin: 0 20px;">
            <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px auto; line-height: 60px;">
              <span style="font-size: 30px;">🔒</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Yêu cầu đặt lại mật khẩu</h1>
          </div>

          <div style="padding: 40px 30px; margin: 0 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 20px 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px; text-align: center;">
              Chúng tôi nhận được yêu cầu thay đổi mật khẩu cho tài khoản NoahShop của bạn. <br>Đừng lo lắng, hãy sử dụng mã bên dưới để thiết lập mật khẩu mới.
            </p>

            <div style="background-color: #fff1f2; border: 2px solid #fecdd3; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
              <span style="display: block; color: #9f1239; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Mã xác minh bảo mật</span>
              <div style="color: #e11d48; font-size: 38px; font-weight: 800; letter-spacing: 12px; font-family: monospace;">${otpCode}</div>
            </div>

            <div style="text-align: center; margin-bottom: 25px;">
                <p style="font-size: 13px; color: #6b7280; font-style: italic;">(Mã này có hiệu lực trong vòng 5 phút)</p>
            </div>

            <div style="border-left: 4px solid #f59e0b; background-color: #fffbeb; padding: 15px; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                <strong>⚠️ Bạn không yêu cầu điều này?</strong><br>
                Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ ngay với bộ phận hỗ trợ để bảo vệ tài khoản.
              </p>
            </div>

            <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px; margin-bottom: 0;">
              Trân trọng,<br>
              <strong style="color: #4b5563;">Đội ngũ bảo mật NoahShop</strong>
            </p>
          </div>

          <div style="padding: 30px 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin-bottom: 10px;">
              Email bảo mật được gửi từ hệ thống NoahShop.
            </p>
            
            <div style="margin: 20px 0; border-top: 1px solid #e5e7eb; width: 100%;"></div>

            <p style="color: #6b7280; font-size: 12px; line-height: 1.6;">
              <strong>CÔNG TY TNHH NOAHSHOP VIỆT NAM</strong><br>
              🏢 Tầng 12, Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh<br>
              📞 Hotline: 1900 123 456 | 📧 Email: support@noahshop.com
            </p>
            
            <p style="color: #d1d5db; font-size: 11px; margin-top: 20px;">
              © ${currentYear} NoahShop. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;
  }
}
