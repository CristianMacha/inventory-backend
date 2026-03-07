import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export class GetCatalogProductsQuery {
  constructor(
    public readonly pagination: PaginationParams,
    public readonly categoryId?: string,
    public readonly levelId?: string,
    public readonly finishId?: string,
    public readonly brandId?: string,
    public readonly search?: string,
  ) {}
}
