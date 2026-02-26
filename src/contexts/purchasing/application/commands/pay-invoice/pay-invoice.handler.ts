import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { PayInvoiceCommand } from './pay-invoice.command';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '../../../domain/value-objects/purchase-invoice-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@CommandHandler(PayInvoiceCommand)
export class PayInvoiceHandler implements ICommandHandler<PayInvoiceCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(command: PayInvoiceCommand): Promise<void> {
    const { invoiceId, userId } = command;

    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(invoiceId),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', invoiceId);
    }

    invoice.pay(userId);
    await this.invoiceRepository.save(invoice);
  }
}
