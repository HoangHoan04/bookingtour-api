import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator để yêu cầu user phải có một trong các roles được chỉ định
 * @param roles Danh sách roles được phép (ví dụ: ['ADMIN', 'MANAGER'])
 */
export const RequireRoles = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles);
