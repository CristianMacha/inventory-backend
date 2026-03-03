import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetSupplierReturnsSelectQuery } from './get-supplier-returns-select.query';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { SupplierReturnSelectOutputDto } from '../../dtos/supplier-return-select-output.dto';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';

@QueryHandler(GetSupplierReturnsSelectQuery)
export class GetSupplierReturnsSelectHandler implements IQueryHandler<GetSupplierReturnsSelectQuery> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
  ) {}

  async execute(
    query: GetSupplierReturnsSelectQuery,
  ): Promise<SupplierReturnSelectOutputDto[]> {
    const returns = await this.supplierReturnRepository.findForSelect({
      supplierId: query.supplierId,
      status: query.status,
      purchaseInvoiceId: query.purchaseInvoiceId,
    });

    return returns.map((ret) => ({
      id: ret.id.getValue(),
      supplierId: ret.supplierId,
      purchaseInvoiceId: ret.purchaseInvoiceId,
      returnDate: ret.returnDate.toISOString().split('T')[0],
      status: ret.status,
      creditAmount: ret.creditAmount,
    }));
  }
}
