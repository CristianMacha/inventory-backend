/**
 * Filters for product list search.
 * Used by IProductRepository.findPaginated.
 */
export interface ProductSearchFilters {
  search?: string;
  brandIds?: string[];
  categoryIds?: string[];
}
