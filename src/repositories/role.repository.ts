import { RoleEntity, UserRoleEntity } from 'src/entities';
import { CustomRepository } from 'src/typeorm';
import { Repository } from 'typeorm';

@CustomRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {}

@CustomRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {}
