import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (
  permissions: string[],
  requireAll: boolean = false,
) => {
  return SetMetadata(PERMISSIONS_KEY, { permissions, requireAll });
};
