import { Permission } from '../entities/permission';
import { PermissionId } from '@contexts/users/domain/value-objects/permission-id';

export interface IPermissionRepository {
  findAll(): Promise<Permission[]>;
  findByName(name: string): Promise<Permission | null>;
  findByIds(ids: PermissionId[]): Promise<Permission[]>;
  findByNames(names: string[]): Promise<Permission[]>;
}
