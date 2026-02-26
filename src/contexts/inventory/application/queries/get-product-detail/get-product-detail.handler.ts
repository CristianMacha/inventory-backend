import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetProductDetailQuery } from './get-product-detail.query';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { ProductDetailOutputDto } from '@contexts/inventory/application/dtos/product-detail-output.dto';
import { ProductResponseMapper } from '@contexts/inventory/application/mappers/product-response.mapper';
import { SlabResponseMapper } from '@contexts/inventory/application/mappers/slab-response.mapper';

@QueryHandler(GetProductDetailQuery)
export class GetProductDetailHandler implements IQueryHandler<GetProductDetailQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(query: GetProductDetailQuery): Promise<ProductDetailOutputDto> {
    const productId = ProductId.create(query.productId);

    const productResult =
      await this.productRepository.findByIdWithRelations(productId);
    if (!productResult) {
      throw new ResourceNotFoundException('Product', query.productId);
    }

    const bundlesWithSlabs =
      await this.bundleRepository.findByProductIdWithSlabs(query.productId);

    const productOutput = ProductResponseMapper.toResponse(
      productResult.product,
      productResult.brand,
      productResult.category,
      productResult.level,
      productResult.finish,
    );

    return {
      ...productOutput,
      bundles: bundlesWithSlabs.map(({ bundle, slabs, supplierName, invoiceNumber }) => ({
        id: bundle.id.getValue(),
        supplierId: bundle.supplierId.getValue(),
        supplierName,
        lotNumber: bundle.lotNumber,
        thicknessCm: bundle.thicknessCm,
        purchaseInvoiceId: bundle.purchaseInvoiceId,
        invoiceNumber,
        slabs: slabs.map((slab) => SlabResponseMapper.toResponse(slab)),
        createdBy: bundle.createdBy,
        updatedBy: bundle.updatedBy,
        createdAt: bundle.createdAt.toISOString(),
        updatedAt: bundle.updatedAt.toISOString(),
      })),
    };
  }
}
