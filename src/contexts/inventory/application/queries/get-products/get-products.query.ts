import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import type { ProductSearchFilters } from '@contexts/inventory/domain/repositories/product-search-filters.interface';

export class GetProductsQuery {
  constructor(
    public readonly filters: ProductSearchFilters,
    public readonly pagination: PaginationParams,
  ) {}
}
