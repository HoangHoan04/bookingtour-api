import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/dto';
import { enumData } from '../constants';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const resultPermission: any = {};

    if (request.user.type === enumData.UserType.Admin.code) {
      request.user.isAdmin = true;
      request.user.fullName = 'Quản trị viên';
      request.user.username = 'ADMIN';
      request.user.avatarUrl = '';
    } else {
      request.user.isAdmin = false;
    }

    return plainToClass(UserDto, {
      ...request.user,
      ...resultPermission,
    });
  },
);
