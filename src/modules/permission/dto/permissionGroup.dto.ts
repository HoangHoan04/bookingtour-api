import { PermissionEntity } from 'src/entities';

export interface PermissionGroup {
  module: string;
  items: PermissionEntity[];
}
