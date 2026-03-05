import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { InvoicePaymentRecordedEvent } from '@contexts/accounting/domain/events/invoice-payment-recorded.event';
import { IPurchaseInvoiceRepository } from '../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '../../domain/value-objects/purchase-invoice-id';
import { PURCHASING_TOKENS } from '../purchasing.tokens';

@EventsHandler(InvoicePaymentRecordedEvent)
export class OnInvoicePaymentRecordedHandler implements IEventHandler<InvoicePaymentRecordedEvent> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async handle(event: InvoicePaymentRecordedEvent): Promise<void> {
    const { invoiceId, paymentAmount, userId } = event;

    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(invoiceId),
    );
    if (!invoice) return;

    invoice.applyPayment(paymentAmount, userId);
    await this.invoiceRepository.save(invoice);
  }
}
