import { Role } from '../entities/role';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';

export interface IRoleRepository {
  save(role: Role): Promise<void>;
  findAll(): Promise<Role[]>;
  findById(id: RoleId): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
}
