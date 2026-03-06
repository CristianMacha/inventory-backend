import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ListInvoicePaymentsQuery } from './list-invoice-payments.query';
import { InvoicePaymentsPageDto } from '../../dtos/invoice-payment-output.dto';
import { ACCOUNTING_TOKENS } from '../../accounting.tokens';
import {
  IInvoicePaymentRepository,
  InvoicePaymentWithContext,
} from '../../../domain/repositories/invoice-payment.repository';

@QueryHandler(ListInvoicePaymentsQuery)
export class ListInvoicePaymentsHandler implements IQueryHandler<ListInvoicePaymentsQuery> {
  constructor(
    @Inject(ACCOUNTING_TOKENS.INVOICE_PAYMENT_REPOSITORY)
    private readonly invoicePaymentRepository: IInvoicePaymentRepository,
  ) {}

  async execute(
    query: ListInvoicePaymentsQuery,
  ): Promise<InvoicePaymentsPageDto> {
    const { pagination, paymentMethod, fromDate, toDate } = query;

    const result = await this.invoicePaymentRepository.findPaginatedWithContext(
      { paymentMethod, fromDate, toDate },
      pagination,
    );

    return {
      payments: result.data.map((p: InvoicePaymentWithContext) => ({
        id: p.id,
        invoiceId: p.invoiceId,
        invoiceNumber: p.invoiceNumber,
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        paymentDate: p.paymentDate.toISOString().split('T')[0],
        reference: p.reference,
        createdBy: p.createdBy,
        createdAt: p.createdAt.toISOString(),
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }
}
