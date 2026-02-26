import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetPurchaseInvoicesSelectQuery } from './get-purchase-invoices-select.query';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceSelectOutputDto } from '../../dtos/purchase-invoice-select-output.dto';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@QueryHandler(GetPurchaseInvoicesSelectQuery)
export class GetPurchaseInvoicesSelectHandler
  implements IQueryHandler<GetPurchaseInvoicesSelectQuery>
{
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(
    query: GetPurchaseInvoicesSelectQuery,
  ): Promise<PurchaseInvoiceSelectOutputDto[]> {
    const invoices = await this.invoiceRepository.findForSelect({
      supplierId: query.supplierId,
      status: query.status,
    });

    return invoices.map((invoice) => ({
      id: invoice.id.getValue(),
      invoiceNumber: invoice.invoiceNumber,
      supplierId: invoice.supplierId,
      invoiceDate: invoice.invoiceDate.toISOString().split('T')[0],
      status: invoice.status,
    }));
  }
}
