import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetProductByIdQuery } from './get-product-by-id.query';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IProductOutputDto } from '@contexts/inventory/application/dtos/product-output.dto';
import { ProductResponseMapper } from '@contexts/inventory/application/mappers/product-response.mapper';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetProductByIdQuery): Promise<IProductOutputDto> {
    const productId = ProductId.create(query.id);
    const result =
      await this.productRepository.findByIdWithBrandAndCategory(productId);
    if (!result) {
      throw new ResourceNotFoundException('Product', query.id);
    }
    return ProductResponseMapper.toResponse(
      result.product,
      result.brand,
      result.category,
    );
  }
}
