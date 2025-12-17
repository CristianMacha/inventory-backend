import { Permission } from '../entities/permission';

export interface IPermissionRepository {
  findAll(): Promise<Permission[]>;
  findByName(name: string): Promise<Permission | null>;
  findByIds(ids: string[]): Promise<Permission[]>;
  findByNames(names: string[]): Promise<Permission[]>;
}
