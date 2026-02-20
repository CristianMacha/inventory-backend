import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { Product } from '@contexts/inventory/domain/entities/product';
import type { ProductSearchFilters } from './product-search-filters.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export interface IProductRepository {
  findAll(): Promise<Product[] | null>;
  findById(id: ProductId): Promise<Product | null>;
  findByIdWithBrandAndCategory(id: ProductId): Promise<{
    product: Product;
    brand?: { id: string; name: string };
    category: { id: string; name: string };
  } | null>;
  findByName(name: string): Promise<Product | null>;
  findByBrandId(brandId: BrandId): Promise<Product[] | null>;
  findByCategoryId(categoryId: CategoryId): Promise<Product[] | null>;
  findPaginated(
    filters: ProductSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>>;
  findPaginatedWithBrandAndCategory(
    filters: ProductSearchFilters,
    pagination: PaginationParams,
  ): Promise<
    PaginatedResult<{
      product: Product;
      brand?: { id: string; name: string };
      category: { id: string; name: string };
    }>
  >;
  save(product: Product): Promise<void>;
  count(): Promise<number>;
}
