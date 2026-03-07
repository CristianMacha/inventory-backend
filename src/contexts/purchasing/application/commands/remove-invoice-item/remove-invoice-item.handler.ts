import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RemoveInvoiceItemCommand } from './remove-invoice-item.command';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '../../../domain/value-objects/purchase-invoice-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@CommandHandler(RemoveInvoiceItemCommand)
export class RemoveInvoiceItemHandler implements ICommandHandler<RemoveInvoiceItemCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
  ) {}

  async execute(command: RemoveInvoiceItemCommand): Promise<void> {
    const { invoiceId, itemId, userId } = command;

    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(invoiceId),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', invoiceId);
    }

    const bundleId = invoice.removeItem(itemId, userId);
    await this.invoiceRepository.deleteItem(itemId);
    await this.invoiceRepository.save(invoice);

    if (bundleId) {
      const bundle = await this.bundleRepository.findById(BundleId.create(bundleId));
      if (bundle) {
        bundle.unlinkInvoice(userId);
        await this.bundleRepository.save(bundle);
      }
    }
  }
}
