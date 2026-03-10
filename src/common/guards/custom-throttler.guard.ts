import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(_context: ExecutionContext): any {
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests, please try again later!',
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const ip = req.ips.length ? req.ips[0] : req.ip;
    const token =
      req.headers['tokenid'] || req.headers['authorization'] || 'global';
    return `${ip}/${token}`;
  }
}
