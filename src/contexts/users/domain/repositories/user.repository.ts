import { User } from '../entities/user';
import { UserId } from '@contexts/users/domain/value-objects/user-id';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

export interface UserFilters {
  search?: string;
  roleId?: string;
}

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByExternalId(provider: string, externalId: string): Promise<User | null>;
  findAllWithRolesPermissions(): Promise<User[]>;
  findPaginated(
    params: PaginationParams,
    filters?: UserFilters,
  ): Promise<PaginatedResult<User>>;
  save(user: User): Promise<void>;
}
