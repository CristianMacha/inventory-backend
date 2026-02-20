import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetProductsQuery } from './get-products.query';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IProductOutputDto } from '@contexts/inventory/application/dtos/product-output.dto';
import { ProductResponseMapper } from '@contexts/inventory/application/mappers/product-response.mapper';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    query: GetProductsQuery,
  ): Promise<PaginatedResult<IProductOutputDto>> {
    const result =
      await this.productRepository.findPaginatedWithBrandAndCategory(
        query.filters,
        query.pagination,
      );
    return {
      ...result,
      data: result.data.map(({ product, brand, category }) =>
        ProductResponseMapper.toResponse(product, brand, category),
      ),
    };
  }
}
