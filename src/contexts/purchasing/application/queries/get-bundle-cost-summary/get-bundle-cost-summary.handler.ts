import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetBundleCostSummaryQuery } from './get-bundle-cost-summary.query';
import {
  IPurchaseInvoiceRepository,
  BundleCostSummary,
} from '../../../domain/repositories/purchase-invoice.repository';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@QueryHandler(GetBundleCostSummaryQuery)
export class GetBundleCostSummaryHandler implements IQueryHandler<GetBundleCostSummaryQuery> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(
    query: GetBundleCostSummaryQuery,
  ): Promise<BundleCostSummary | null> {
    return this.invoiceRepository.getBundleCostSummary(query.bundleId);
  }
}
