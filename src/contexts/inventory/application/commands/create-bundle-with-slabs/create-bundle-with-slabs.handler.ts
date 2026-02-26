import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { CreateBundleWithSlabsCommand } from './create-bundle-with-slabs.command';
import { IBundleRepository } from '../../../domain/repositories/bundle.repository';
import { IProductRepository } from '../../../domain/repositories/product.repository';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { IPurchaseInvoiceRepository } from '@contexts/purchasing/domain/repositories/purchase-invoice.repository';
import { Bundle } from '../../../domain/entities/bundle';
import { Slab } from '../../../domain/entities/slab';
import { ProductId } from '../../../domain/value-objects/product-id';
import { SupplierId } from '../../../domain/value-objects/supplier-id';
import { BundleId } from '../../../domain/value-objects/bundle-id';
import { PurchaseInvoiceId } from '@contexts/purchasing/domain/value-objects/purchase-invoice-id';
import { SlabDimensions } from '../../../domain/value-objects/slab-dimensions';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';

export interface CreateBundleWithSlabsResult {
  bundle: Bundle;
  slabs: Slab[];
  productName: string;
  supplierName: string;
  invoiceNumber: string | null;
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
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(
    command: CreateBundleWithSlabsCommand,
  ): Promise<CreateBundleWithSlabsResult> {
    const { productId, lotNumber, thicknessCm, createdBy, slabs, purchaseInvoiceId } = command;
    let { supplierId } = command;
    let invoiceNumber: string | null = null;

    const product = await this.productRepository.findById(ProductId.create(productId));
    if (!product) {
      throw new ResourceNotFoundException('Product', productId);
    }

    if (purchaseInvoiceId) {
      const invoice = await this.invoiceRepository.findById(
        PurchaseInvoiceId.create(purchaseInvoiceId),
      );
      if (!invoice) {
        throw new ResourceNotFoundException('PurchaseInvoice', purchaseInvoiceId);
      }
      supplierId = invoice.supplierId;
      invoiceNumber = invoice.invoiceNumber;
    }

    if (!supplierId) {
      throw new BadRequestException('supplierId or purchaseInvoiceId is required');
    }

    const supplier = await this.supplierRepository.findById(SupplierId.create(supplierId));
    if (!supplier) {
      throw new ResourceNotFoundException('Supplier', supplierId);
    }

    const bundle = Bundle.create(
      ProductId.create(productId),
      SupplierId.create(supplierId),
      lotNumber ?? '',
      thicknessCm ?? 0,
      createdBy,
      purchaseInvoiceId ?? null,
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
      invoiceNumber,
    };
  }
}
