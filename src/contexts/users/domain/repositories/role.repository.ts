import { Role } from '../entities/role';

export interface IRoleRepository {
  save(role: Role): Promise<void>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
}
