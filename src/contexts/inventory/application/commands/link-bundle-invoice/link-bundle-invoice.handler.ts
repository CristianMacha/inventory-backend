import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { LinkBundleInvoiceCommand } from './link-bundle-invoice.command';
import { IBundleRepository } from '@contexts/inventory/domain/repositories/bundle.repository';
import { IPurchaseInvoiceRepository } from '@contexts/purchasing/domain/repositories/purchase-invoice.repository';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { PurchaseInvoiceId } from '@contexts/purchasing/domain/value-objects/purchase-invoice-id';
import { PurchaseInvoiceStatus } from '@contexts/purchasing/domain/enums/purchase-invoice-status.enum';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { DomainException } from '@shared/domain/domain.exception';
import { HttpStatus } from '@nestjs/common';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';

@CommandHandler(LinkBundleInvoiceCommand)
export class LinkBundleInvoiceHandler implements ICommandHandler<LinkBundleInvoiceCommand> {
  constructor(
    @Inject(INVENTORY_TOKENS.BUNDLE_REPOSITORY)
    private readonly bundleRepository: IBundleRepository,
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(command: LinkBundleInvoiceCommand): Promise<void> {
    const { bundleId, purchaseInvoiceId, updatedBy } = command;

    const bundle = await this.bundleRepository.findById(
      BundleId.create(bundleId),
    );
    if (!bundle) {
      throw new ResourceNotFoundException('Bundle', bundleId);
    }

    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(purchaseInvoiceId),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', purchaseInvoiceId);
    }

    if (invoice.status === PurchaseInvoiceStatus.CANCELLED) {
      throw new DomainException(
        `Cannot link bundle to a CANCELLED invoice.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (bundle.supplierId.getValue() !== invoice.supplierId) {
      throw new DomainException(
        `Bundle supplier does not match invoice supplier.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    bundle.linkInvoice(purchaseInvoiceId, updatedBy);
    await this.bundleRepository.save(bundle);
  }
}
