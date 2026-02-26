import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ReceiveInvoiceCommand } from './receive-invoice.command';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '../../../domain/value-objects/purchase-invoice-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@CommandHandler(ReceiveInvoiceCommand)
export class ReceiveInvoiceHandler implements ICommandHandler<ReceiveInvoiceCommand> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: ReceiveInvoiceCommand): Promise<void> {
    const { invoiceId, userId } = command;

    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(invoiceId),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', invoiceId);
    }

    invoice.receive(userId);
    await this.invoiceRepository.save(invoice);
    this.eventBus.publishAll(invoice.getUncommittedEvents());
    invoice.commit();
  }
}
