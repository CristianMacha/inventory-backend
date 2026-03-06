import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetUsersQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly search?: string,
    public readonly roleId?: string,
  ) {}
}
