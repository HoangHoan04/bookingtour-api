import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestContext } from 'src/common/core/context';
import { ClsHook } from 'src/common/core/context/cls-hook';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    try {
      const requestContext = new RequestContext(req, res);
      ClsHook.run(() => {
        ClsHook.set(RequestContext.name, requestContext);
        next();
      });
    } catch (error) {
      next();
    }
  }
}
