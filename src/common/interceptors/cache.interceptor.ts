import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { from, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

function isPromiseLike(v: any): v is Promise<any> {
  return v && typeof v.then === 'function';
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();

    const url = request.url;
    const method = request.method;
    const body = request.body;

    const maxLengthKey = 10000;

    const key = `${process.env.DB_PRIMARY_DATABASE}:${url}:${method}:${body ? JSON.stringify(body) : ''}`;
    if (key.length <= maxLengthKey) {
      const checkKey: any = await this.cacheManager.get(key);

      if (checkKey) {
        return of(checkKey);
      }
    }

    request.headers['keyCache'] = key;

    return next.handle().pipe(
      mergeMap((v) => (isPromiseLike(v) ? from(v) : of(v))),
      tap((res) => {
        const isCache = request.headers['isCache'];
        if (isCache) {
          const key = request.headers['keyCache'] as string;
          if (key.length <= maxLengthKey) {
            void this.cacheManager.set(key, res).catch((error) => {
              console.error('Error set cache:', error?.message);
            });
          }
        }
      }),
    );
  }
}