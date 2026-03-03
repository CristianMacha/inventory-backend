import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetProductsSelectQuery } from './get-products-select.query';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { ProductSelectOutputDto } from '@contexts/inventory/application/dtos/product-select-output.dto';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetProductsSelectQuery)
export class GetProductsSelectHandler implements IQueryHandler<GetProductsSelectQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<ProductSelectOutputDto[]> {
    return this.productRepository.findForSelect();
  }
}
