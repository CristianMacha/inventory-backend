import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetCatalogProductsQuery } from './get-catalog-products.query';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import type { CatalogProductOutputDto } from '@contexts/inventory/application/dtos/catalog-product-output.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@QueryHandler(GetCatalogProductsQuery)
export class GetCatalogProductsHandler
  implements IQueryHandler<GetCatalogProductsQuery>
{
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    query: GetCatalogProductsQuery,
  ): Promise<PaginatedResult<CatalogProductOutputDto>> {
    const result = await this.productRepository.findPaginatedCatalog(
      {
        categoryId: query.categoryId,
        levelId: query.levelId,
        finishId: query.finishId,
        brandId: query.brandId,
        search: query.search,
      },
      query.pagination,
    );

    return {
      ...result,
      data: result.data.map(({ product, brand, category, level, finish }) => ({
        id: product.id.getValue(),
        name: product.name,
        description: product.description,
        category,
        level,
        finish,
        ...(brand && { brand }),
      })),
    };
  }
}
