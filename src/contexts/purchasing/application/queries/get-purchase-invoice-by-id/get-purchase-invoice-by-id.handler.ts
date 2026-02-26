import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetPurchaseInvoiceByIdQuery } from './get-purchase-invoice-by-id.query';
import { IPurchaseInvoiceRepository } from '../../../domain/repositories/purchase-invoice.repository';
import { PurchaseInvoiceId } from '../../../domain/value-objects/purchase-invoice-id';
import { PurchaseInvoiceDetailOutputDto } from '../../dtos/purchase-invoice-output.dto';
import { PurchaseInvoiceResponseMapper } from '../../mappers/purchase-invoice-response.mapper';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@QueryHandler(GetPurchaseInvoiceByIdQuery)
export class GetPurchaseInvoiceByIdHandler implements IQueryHandler<GetPurchaseInvoiceByIdQuery> {
  constructor(
    @Inject(PURCHASING_TOKENS.PURCHASE_INVOICE_REPOSITORY)
    private readonly invoiceRepository: IPurchaseInvoiceRepository,
  ) {}

  async execute(
    query: GetPurchaseInvoiceByIdQuery,
  ): Promise<PurchaseInvoiceDetailOutputDto> {
    const invoice = await this.invoiceRepository.findById(
      PurchaseInvoiceId.create(query.id),
    );
    if (!invoice) {
      throw new ResourceNotFoundException('PurchaseInvoice', query.id);
    }

    const itemsWithBundleInfo =
      await this.invoiceRepository.findItemsWithBundleInfo(query.id);
    return PurchaseInvoiceResponseMapper.toDetailResponse(
      invoice,
      itemsWithBundleInfo,
    );
  }
}
