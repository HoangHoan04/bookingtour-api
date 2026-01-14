import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/require-roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Không có yêu cầu role thì cho phép
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Người dùng chưa đăng nhập');
    }

    // Admin có tất cả quyền
    if (user.isAdmin) {
      return true;
    }

    // Lấy danh sách role codes của user
    const userRoles: string[] = user.roles?.map((role) => role.code) || [];

    // Kiểm tra xem user có ít nhất một trong các roles yêu cầu không
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Bạn không có quyền. Cần có vai trò: ${requiredRoles.join(' hoặc ')}`,
      );
    }

    return true;
  }
}
