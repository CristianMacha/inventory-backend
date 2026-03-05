import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetBundlesQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly productId?: string,
    public readonly supplierId?: string,
    public readonly search?: string,
  ) {}
}
