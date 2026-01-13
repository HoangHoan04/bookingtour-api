import {
  PermissionEntity,
  RoleEntity,
  RolePermissionEntity,
  UserRoleEntity,
} from 'src/entities';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {}

@CustomRepository(PermissionEntity)
export class PermissionRepository extends Repository<PermissionEntity> {}

@CustomRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {}

@CustomRepository(RolePermissionEntity)
export class RolePermissionRepository extends Repository<RolePermissionEntity> {}

@CustomRepository(RolePermissionEntity)
export class RolePermissionsRepository extends Repository<RolePermissionEntity> {}
