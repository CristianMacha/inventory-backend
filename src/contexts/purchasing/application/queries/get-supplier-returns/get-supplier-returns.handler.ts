import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetSupplierReturnsQuery } from './get-supplier-returns.query';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';
import { SupplierReturnResponseMapper } from '../../mappers/supplier-return-response.mapper';
import { SupplierReturnOutputDto } from '../../dtos/supplier-return-output.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@QueryHandler(GetSupplierReturnsQuery)
export class GetSupplierReturnsHandler implements IQueryHandler<GetSupplierReturnsQuery> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
  ) {}

  async execute(query: GetSupplierReturnsQuery): Promise<PaginatedResult<SupplierReturnOutputDto>> {
    const result = await this.supplierReturnRepository.findPaginated(
      {
        supplierId: query.supplierId,
        status: query.status,
        purchaseInvoiceId: query.purchaseInvoiceId,
      },
      query.pagination,
    );

    return {
      ...result,
      data: result.data.map((r) => SupplierReturnResponseMapper.toResponse(r)),
    };
  }
}
