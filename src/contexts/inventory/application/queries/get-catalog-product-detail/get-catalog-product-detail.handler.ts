import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';

import { GetCatalogProductDetailQuery } from './get-catalog-product-detail.query';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import type { CatalogProductDetailOutputDto } from '@contexts/inventory/application/dtos/catalog-product-output.dto';

@QueryHandler(GetCatalogProductDetailQuery)
export class GetCatalogProductDetailHandler implements IQueryHandler<GetCatalogProductDetailQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(
    query: GetCatalogProductDetailQuery,
  ): Promise<CatalogProductDetailOutputDto> {
    const productWithRelations =
      await this.productRepository.findByIdWithRelations(
        ProductId.create(query.productId),
      );

    if (
      !productWithRelations ||
      !productWithRelations.product.isOnline ||
      !productWithRelations.product.isActive
    ) {
      throw new NotFoundException(
        `Product with id ${query.productId} not found`,
      );
    }

    const { product, brand, category, level, finish } = productWithRelations;

    const bundlesWithSlabs =
      await this.bundleRepository.findAvailableByProductId(
        product.id.getValue(),
      );

    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      category,
      level,
      finish,
      ...(brand && { brand }),
      bundles: bundlesWithSlabs.map(({ bundle, slabs }) => ({
        id: bundle.id.getValue(),
        lotNumber: bundle.lotNumber,
        thicknessCm: bundle.thicknessCm,
        imagePublicId: bundle.imagePublicId,
        slabs: slabs.map((slab) => ({
          id: slab.id.getValue(),
          code: slab.code,
          widthCm: slab.dimensions.width,
          heightCm: slab.dimensions.height,
          status: slab.status,
        })),
      })),
    };
  }
}
