import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from './get-products.query';
import { Inject } from '@nestjs/common';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IProductOutputDto } from '@contexts/inventory/application/dtos/product-output.dto';
import { ProductResponseMapper } from '@contexts/inventory/application/mappers/product-response.mapper';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(query: GetProductsQuery): Promise<IProductOutputDto[] | null> {
    const products = await this.productRepository.findAll();

    return products
      ? products.map((product) => ProductResponseMapper.toResponse(product))
      : null;
  }
}
