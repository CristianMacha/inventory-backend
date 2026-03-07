import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetPurchaseInvoicesQuery } from './get-purchase-invoices.query';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceOutputDto } from '../../dtos/purchase-invoice-output.dto';
import { PurchaseInvoiceResponseMapper } from '../../mappers/purchase-invoice-response.mapper';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@QueryHandler(GetPurchaseInvoicesQuery)
export class GetPurchaseInvoicesHandler implements IQueryHandler<GetPurchaseInvoicesQuery> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(
    query: GetPurchaseInvoicesQuery,
  ): Promise<PaginatedResult<PurchaseInvoiceOutputDto>> {
    const result = await this.invoiceRepository.findPaginated(
      {
        supplierId: query.supplierId,
        status: query.status,
        search: query.search,
      },
      query.pagination,
    );
    return {
      ...result,
      data: result.data.map(({ invoice, supplierName }) =>
        PurchaseInvoiceResponseMapper.toResponse(invoice, supplierName),
      ),
    };
  }
}
