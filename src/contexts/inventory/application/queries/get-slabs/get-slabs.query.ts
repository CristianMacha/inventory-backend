import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetSlabsQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly bundleId?: string,
  ) {}
}
