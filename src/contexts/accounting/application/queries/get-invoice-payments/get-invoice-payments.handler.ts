import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetInvoicePaymentsQuery } from './get-invoice-payments.query';
import { InvoicePaymentsWithSummaryDto } from '../../dtos/invoice-payment-output.dto';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import { PURCHASING_TOKENS } from '@contexts/purchasing/application/purchasing.tokens';
import { IInvoicePaymentRepository } from '../../../domain/repositories/invoice-payment.repository';
import { IPurchaseInvoiceRepository } from '@contexts/purchasing/domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '@contexts/purchasing/domain/value-objects/purchase-invoice-id';
import { InvoicePaymentResponseMapper } from '../../mappers/invoice-payment-response.mapper';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';

@QueryHandler(GetInvoicePaymentsQuery)
export class GetInvoicePaymentsHandler
  implements IQueryHandler<GetInvoicePaymentsQuery>
{
  constructor(
    @Inject(ACCOUNTING_TOKENS.INVOICE_PAYMENT_REPOSITORY)
    private readonly invoicePaymentRepository: IInvoicePaymentRepository,
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(
    query: GetInvoicePaymentsQuery,
  ): Promise<InvoicePaymentsWithSummaryDto> {
    const { invoiceId } = query;

    const [invoice, payments] = await Promise.all([
      this.invoiceRepository.findById(PurchaseInvoiceId.create(invoiceId)),
      this.invoicePaymentRepository.findByInvoiceId(invoiceId),
    ]);

    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', invoiceId);
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = invoice.totalAmount - totalPaid;

    return {
      payments: payments.map(InvoicePaymentResponseMapper.toResponse),
      totalPaid,
      remaining,
      invoiceTotalAmount: invoice.totalAmount,
    };
  }
}
