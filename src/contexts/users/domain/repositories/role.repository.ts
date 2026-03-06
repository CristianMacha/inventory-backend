import { Role } from '../entities/role';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface IRoleRepository {
  save(role: Role): Promise<void>;
  findAll(): Promise<Role[]>;
  findPaginated(
    params: PaginationParams,
    search?: string,
  ): Promise<PaginatedResult<Role>>;
  findById(id: RoleId): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
}
