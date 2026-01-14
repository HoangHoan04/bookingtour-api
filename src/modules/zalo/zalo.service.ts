import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  ACCESS_TOKEN_INVALID,
  enumData,
  enumZalo,
  INVALID_REFRESH_TOKEN,
  OA_ID_INVALID,
  REFRESH_TOKEN_EXPIRED,
  SettingString,
  SUCCESS,
} from 'src/common/constants';
import { coreHelper } from 'src/helpers';
import { SettingStringRepository } from 'src/repositories';
import { ActionLogService } from '../actionLog/actionLog.service';
import { ActionLogCreateDto } from '../actionLog/dto';

@Injectable()
export class ZaloService {
  constructor(
    private httpService: HttpService,
    private actionLogService: ActionLogService,
    private settingStringRepo: SettingStringRepository,
  ) {}

  private callApi(url: string, data: any, config: any) {
    return new Promise((resolve, reject) => {
      const request = this.httpService.post(url, data, { headers: config });
      lastValueFrom(request)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err: any) => {
          console.log(err);
          throw err;
        });
    });
  }

  public async getAccessTokenWithRefreshToken(username: string) {
    const settingRf = await this.settingStringRepo.findOne({
      where: { code: SettingString.ZALO_REFRESH_TOKEN.code },
    });

    if (!settingRf) {
      throw new Error('Zalo refresh token setting not found');
    }

    const config = {
      'Content-Type': 'application/x-www-form-urlencoded',
      secret_key: `${process.env.ZNS_SECRETKEY}`,
    };
    const obj: any = {
      refresh_token: settingRf?.value,
      app_id: `${process.env.ZNS_APP_ID}`,
      grant_type: 'refresh_token',
    };
    const url = `https://oauth.zaloapp.com/v4/oa/access_token`;
    let formBody: any = [];
    for (const property in obj) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(obj[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    let res: any;
    const actionLog: ActionLogCreateDto = {
      functionId: settingRf.id,
      functionType: 'SettingString',
      type: enumData.ActionLogType.UPDATE.code,
      createdBy: username,
      createdByName: username,
      description: `[${username}] đã gọi API lấy access token từ refresh token`,
    };
    try {
      await this.actionLogService.create(actionLog);
      res = await this.callApi(url, formBody, config);
    } catch (error) {
      actionLog.description += ` - Lỗi: ${JSON.stringify(error)}`;
      await this.actionLogService.create(actionLog);
    }

    if (!res) {
      await this.settingStringRepo.update(
        { code: SettingString.CHECK_ZALO.code },
        { valueString: `err zalo ${new Date().toISOString()}: Lỗi gọi API` },
      );
      return { message: 'Lỗi gọi API' };
    }

    if (
      res?.error == REFRESH_TOKEN_EXPIRED ||
      res?.error == INVALID_REFRESH_TOKEN
    ) {
      await this.settingStringRepo.update(
        { code: SettingString.CHECK_ZALO.code },
        {
          valueString: `err zalo ${new Date().toISOString()}: ${JSON.stringify(res)}`,
        },
      );
      return { message: 'Refresh token hết hạn', res };
    }

    const accessToken = res.accessToken || res.access_token;
    if (accessToken) {
      await this.settingStringRepo.update(
        { code: SettingString.ZALO_ACCESS_TOKEN.code },
        { valueString: accessToken },
      );
    }

    const refreshToken = res.refreshToken || res.refresh_token;
    if (refreshToken) {
      await this.settingStringRepo.update(
        { code: SettingString.ZALO_REFRESH_TOKEN.code },
        { valueString: refreshToken },
      );
    }
    return { accessToken, refreshToken };
  }

  public async sendOtpCode(data: {
    phone: string;
    otpCode: string;
  }): Promise<{ isSuccess: boolean; message?: string; code?: number }> {
    const settingAc = await this.settingStringRepo.findOne({
      where: { code: SettingString.ZALO_ACCESS_TOKEN.code },
    });

    if (!settingAc?.value) {
      const getAccess =
        await this.getAccessTokenWithRefreshToken('feature_system_1');

      if (getAccess?.accessToken) {
        return await this.sendOtpCode(data);
      }
      return {
        isSuccess: false,
        message: 'Vui lòng kiểm tra lại mã truy cập!',
      };
    }

    const accessTokenZalo = settingAc.value;

    const config = {
      'Content-Type': 'application/json',
      access_token: accessTokenZalo,
    };

    const lstError = coreHelper.convertObjToArray(enumZalo.ErrorCodeTableZalo);

    const obj = {
      phone: coreHelper.normalizePhoneNumber(data.phone),
      template_id: `${enumData.TemplateZalo.ZNS_TEMPLATE_ID_SEND_OTP}`,
      template_data: { otp: data.otpCode },
    };

    const url = `https://business.openapi.zalo.me/message/template`;

    const res: any = await this.callApi(url, obj, config);

    if (res.error == SUCCESS) {
      return { isSuccess: true, message: 'Gửi mã OTP thành công!' };
    }
    if (res.error == ACCESS_TOKEN_INVALID || res.error == OA_ID_INVALID) {
      const getToken =
        await this.getAccessTokenWithRefreshToken('feature_system_2');
      if (getToken?.accessToken) {
        return await this.sendOtpCode(data);
      }
      return {
        isSuccess: false,
        message: `Vui lòng kiểm tra lại mã truy cập! [code: ${res.error}]`,
        code: res.error,
      };
    }
    const error = lstError.find((s: any) => s.code == res.error);
    return {
      isSuccess: false,
      message: `${error?.message || 'Đã xảy ra lỗi'} [code: ${res.error}]`,
      code: res.error,
    };
  }

  async autoUpdateAccessToken() {
    try {
      await this.getAccessTokenWithRefreshToken('system');
    } catch (error) {
      await this.settingStringRepo.update(
        { code: SettingString.CHECK_ZALO.code },
        { valueString: `err zalo: ${JSON.stringify(error)}` },
      );
    }
  }
}
