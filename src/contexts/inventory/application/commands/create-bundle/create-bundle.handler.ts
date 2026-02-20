import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateBundleCommand } from './create-bundle.command';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { IProductRepository } from '../../../domain/repositories/product.repository';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { Bundle } from '../../../domain/entities/bundle';
import { ProductId } from '../../../domain/value-objects/product-id';
import { SupplierId } from '../../../domain/value-objects/supplier-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(CreateBundleCommand)
export class CreateBundleHandler implements ICommandHandler<CreateBundleCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(command: CreateBundleCommand): Promise<void> {
    const { productId, supplierId, lotNumber, thicknessCm, createdBy } =
      command;

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

    const bundle = Bundle.create(
      ProductId.create(productId),
      SupplierId.create(supplierId),
      lotNumber ?? '',
      thicknessCm ?? 0,
      createdBy,
    );

    await this.bundleRepository.save(bundle);
  }
}
