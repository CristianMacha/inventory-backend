import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AddInvoiceItemCommand } from './add-invoice-item.command';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '../../../domain/value-objects/purchase-invoice-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(AddInvoiceItemCommand)
export class AddInvoiceItemHandler implements ICommandHandler<AddInvoiceItemCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(command: AddInvoiceItemCommand): Promise<void> {
    const {
      invoiceId,
      bundleId,
      concept,
      description,
      unitCost,
      quantity,
      userId,
    } = command;

    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(invoiceId),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', invoiceId);
    }

    const bundleWithProduct =
      await this.bundleRepository.findByIdWithProductName(
        BundleId.create(bundleId),
      );
    if (!bundleWithProduct) {
      throw new ResourceNotFoundException('Bundle', bundleId);
    }
    const { bundle, productName } = bundleWithProduct;

    const resolvedDescription =
      description ??
      (bundle.lotNumber
        ? `${productName} - LOT ${bundle.lotNumber}`
        : productName);

    invoice.addItem(
      bundleId,
      concept,
      resolvedDescription,
      unitCost,
      quantity,
      userId,
    );
    bundle.linkInvoice(invoiceId, userId);

    await this.invoiceRepository.save(invoice);
    await this.bundleRepository.save(bundle);
  }
}
