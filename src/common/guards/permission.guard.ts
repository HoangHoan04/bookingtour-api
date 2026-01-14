import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionsMetadata = this.reflector.getAllAndOverride<{
      permissions: string[];
      requireAll: boolean;
    }>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!permissionsMetadata) {
      return true; // Không có yêu cầu permission thì cho phép
    }

    const { permissions: requiredPermissions, requireAll } =
      permissionsMetadata;

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
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

    // Lấy danh sách permissions của user
    const userPermissions: string[] = user.permissions || [];

    // Kiểm tra permissions
    if (requireAll) {
      // Yêu cầu có tất cả permissions
      const hasAllPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );
      if (!hasAllPermissions) {
        throw new ForbiddenException(
          `Bạn không có đủ quyền. Cần có tất cả: ${requiredPermissions.join(', ')}`,
        );
      }
    } else {
      // Chỉ cần có ít nhất một permission
      const hasAnyPermission = requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      );
      if (!hasAnyPermission) {
        throw new ForbiddenException(
          `Bạn không có quyền. Cần có ít nhất một trong: ${requiredPermissions.join(', ')}`,
        );
      }
    }

    return true;
  }
}
