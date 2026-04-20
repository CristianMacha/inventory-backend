import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { SetPrimarySupplierCommand } from './set-primary-supplier.command';
import { IProductSupplierRepository } from '@contexts/inventory/domain/repositories/product-supplier.repository';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { ProductSupplierId } from '@contexts/inventory/domain/value-objects/product-supplier-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(SetPrimarySupplierCommand)
export class SetPrimarySupplierHandler implements ICommandHandler<SetPrimarySupplierCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_SUPPLIER_REPOSITORY)
    private readonly productSupplierRepository: IProductSupplierRepository,
  ) {}

  async execute(command: SetPrimarySupplierCommand): Promise<void> {
    const { productId, productSupplierId } = command;

    const target = await this.productSupplierRepository.findById(
      ProductSupplierId.create(productSupplierId),
    );
    if (!target) {
      throw new ResourceNotFoundException('ProductSupplier', productSupplierId);
    }

    const all = await this.productSupplierRepository.findByProductId(
      ProductId.create(productId),
    );

    for (const ps of all) {
      const shouldBePrimary = ps.id.getValue() === productSupplierId;
      if (ps.isPrimary !== shouldBePrimary) {
        ps.setPrimary(shouldBePrimary);
        await this.productSupplierRepository.save(ps);
      }
    }
  }
}
