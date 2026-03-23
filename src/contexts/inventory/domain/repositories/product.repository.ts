import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { Product } from '@contexts/inventory/domain/entities/product';
import type { ProductSearchFilters } from './product-search-filters.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import type { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export interface ProductWithRelations {
  product: Product;
  brand?: { id: string; name: string };
  category: { id: string; name: string };
  level: { id: string; name: string };
  finish: { id: string; name: string };
}

export interface CatalogFilters {
  categoryId?: string;
  levelId?: string;
  finishId?: string;
  brandId?: string;
  search?: string;
}

export interface IProductRepository {
  findAll(): Promise<Product[] | null>;
  findById(id: ProductId): Promise<Product | null>;
  findByIdWithRelations(id: ProductId): Promise<ProductWithRelations | null>;
  findBySlugWithRelations(slug: string): Promise<ProductWithRelations | null>;
  findByName(name: string): Promise<Product | null>;
  findByBrandId(brandId: BrandId): Promise<Product[] | null>;
  findByCategoryId(categoryId: CategoryId): Promise<Product[] | null>;
  findPaginated(
    filters: ProductSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>>;
  findPaginatedWithRelations(
    filters: ProductSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ProductWithRelations>>;
  findPaginatedCatalog(
    filters: CatalogFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ProductWithRelations>>;
  findForSelect(): Promise<{ id: string; name: string }[]>;
  save(product: Product): Promise<void>;
  count(): Promise<number>;
}
