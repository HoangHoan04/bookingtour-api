import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/dto';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const resultPermission: any = {};

    return plainToClass(UserDto, {
      ...request.user,
      ...resultPermission,
    });
  },
);
