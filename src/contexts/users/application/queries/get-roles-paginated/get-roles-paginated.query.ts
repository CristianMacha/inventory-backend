import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetRolesPaginatedQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly search?: string,
  ) {}
}
