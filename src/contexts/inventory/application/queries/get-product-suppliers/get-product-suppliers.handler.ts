import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetProductSuppliersQuery } from './get-product-suppliers.query';
import { IProductSupplierRepository } from '@contexts/inventory/domain/repositories/product-supplier.repository';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { ProductSupplierOutputDto } from '@contexts/inventory/application/dtos/product-supplier-output.dto';

@QueryHandler(GetProductSuppliersQuery)
export class GetProductSuppliersHandler implements IQueryHandler<GetProductSuppliersQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_SUPPLIER_REPOSITORY)
    private readonly productSupplierRepository: IProductSupplierRepository,
  ) {}

  async execute(
    query: GetProductSuppliersQuery,
  ): Promise<ProductSupplierOutputDto[]> {
    const results =
      await this.productSupplierRepository.findByProductIdWithNames(
        ProductId.create(query.productId),
      );

    return results.map((r) => ({
      id: r.id,
      supplierId: r.supplierId,
      supplierName: r.supplierName,
      supplierAbbreviation: r.supplierAbbreviation,
      isPrimary: r.isPrimary,
    }));
  }
}
