import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateBundleWithSlabsCommand } from './create-bundle-with-slabs.command';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { IProductRepository } from '../../../domain/repositories/product.repository';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { Bundle } from '../../../domain/entities/bundle';
import { Slab } from '../../../domain/entities/slab';
import { ProductId } from '../../../domain/value-objects/product-id';
import { SupplierId } from '../../../domain/value-objects/supplier-id';
import { BundleId } from '../../../domain/value-objects/bundle-id';
import { SlabDimensions } from '../../../domain/value-objects/slab-dimensions';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

export interface CreateBundleWithSlabsResult {
  bundle: Bundle;
  slabs: Slab[];
  productName: string;
  supplierName: string;
}

@CommandHandler(CreateBundleWithSlabsCommand)
export class CreateBundleWithSlabsHandler implements ICommandHandler<CreateBundleWithSlabsCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
    @Inject(INVENTORY_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(
    command: CreateBundleWithSlabsCommand,
  ): Promise<CreateBundleWithSlabsResult> {
    const { productId, supplierId, lotNumber, thicknessCm, createdBy, slabs } =
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

    const createdSlabs: Slab[] = slabs.map((slabInput) => {
      const dimensions = new SlabDimensions(
        slabInput.widthCm,
        slabInput.heightCm,
      );
      return Slab.create(
        BundleId.create(bundle.id.getValue()),
        slabInput.code,
        dimensions,
        slabInput.description ?? '',
        createdBy,
      );
    });

    await this.bundleRepository.saveWithSlabs(bundle, createdSlabs);

    return {
      bundle,
      slabs: createdSlabs,
      productName: product.name,
      supplierName: supplier.name,
    };
  }
}
