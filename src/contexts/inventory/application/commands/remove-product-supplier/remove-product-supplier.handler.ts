import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RemoveProductSupplierCommand } from './remove-product-supplier.command';
import { IProductSupplierRepository } from '@contexts/inventory/domain/repositories/product-supplier.repository';
import { ProductSupplierId } from '@contexts/inventory/domain/value-objects/product-supplier-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(RemoveProductSupplierCommand)
export class RemoveProductSupplierHandler implements ICommandHandler<RemoveProductSupplierCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_SUPPLIER_REPOSITORY)
    private readonly productSupplierRepository: IProductSupplierRepository,
  ) {}

  async execute(command: RemoveProductSupplierCommand): Promise<void> {
    const { productSupplierId } = command;

    const ps = await this.productSupplierRepository.findById(
      ProductSupplierId.create(productSupplierId),
    );
    if (!ps) {
      throw new ResourceNotFoundException('ProductSupplier', productSupplierId);
    }

    await this.productSupplierRepository.delete(
      ProductSupplierId.create(productSupplierId),
    );
  }
}
