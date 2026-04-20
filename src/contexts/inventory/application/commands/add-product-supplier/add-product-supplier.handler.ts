import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AddProductSupplierCommand } from './add-product-supplier.command';
import { IProductSupplierRepository } from '@contexts/inventory/domain/repositories/product-supplier.repository';
import { IProductRepository } from '@contexts/inventory/domain/repositories/product.repository';
import { ISupplierRepository } from '@contexts/inventory/domain/repositories/supplier.repository';
import { ProductSupplier } from '@contexts/inventory/domain/entities/product-supplier';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { SupplierId } from '@contexts/inventory/domain/value-objects/supplier-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { SupplierAlreadyLinkedToProductException } from '@contexts/inventory/domain/errors/supplier-already-linked-to-product.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(AddProductSupplierCommand)
export class AddProductSupplierHandler implements ICommandHandler<AddProductSupplierCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.PRODUCT_SUPPLIER_REPOSITORY)
    private readonly productSupplierRepository: IProductSupplierRepository,
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(command: AddProductSupplierCommand): Promise<void> {
    const { productId, supplierId, isPrimary } = command;

    const product = await this.productRepository.findById(
      ProductId.create(productId),
    );
    if (!product) {
      throw new ResourceNotFoundException('Product', productId);
    }

    const supplier = await this.supplierRepository.findById(
      SupplierId.create(supplierId),
    );
    if (!supplier) {
      throw new ResourceNotFoundException('Supplier', supplierId);
    }

    const existing =
      await this.productSupplierRepository.findByProductIdAndSupplierId(
        ProductId.create(productId),
        SupplierId.create(supplierId),
      );
    if (existing) {
      throw new SupplierAlreadyLinkedToProductException(supplierId, productId);
    }

    if (isPrimary) {
      const current = await this.productSupplierRepository.findByProductId(
        ProductId.create(productId),
      );
      for (const ps of current) {
        if (ps.isPrimary) {
          ps.setPrimary(false);
          await this.productSupplierRepository.save(ps);
        }
      }
    }

    const productSupplier = ProductSupplier.create(
      ProductId.create(productId),
      SupplierId.create(supplierId),
      isPrimary,
    );
    await this.productSupplierRepository.save(productSupplier);
  }
}
