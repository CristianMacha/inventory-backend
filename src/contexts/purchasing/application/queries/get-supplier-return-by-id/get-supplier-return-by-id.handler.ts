import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetSupplierReturnByIdQuery } from './get-supplier-return-by-id.query';
import { ISupplierReturnRepository } from '../../../domain/repositories/supplier-return.repository';
import { SupplierReturnId } from '../../../domain/value-objects/supplier-return-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { PURCHASING_TOKENS } from '../../purchasing.tokens';
import { SupplierReturnResponseMapper } from '../../mappers/supplier-return-response.mapper';
import { SupplierReturnDetailOutputDto } from '../../dtos/supplier-return-output.dto';

@QueryHandler(GetSupplierReturnByIdQuery)
export class GetSupplierReturnByIdHandler implements IQueryHandler<GetSupplierReturnByIdQuery> {
  constructor(
    @Inject(PURCHASING_TOKENS.SUPPLIER_RETURN_REPOSITORY)
    private readonly supplierReturnRepository: ISupplierReturnRepository,
  ) {}

  async execute(
    query: GetSupplierReturnByIdQuery,
  ): Promise<SupplierReturnDetailOutputDto> {
    const result = await this.supplierReturnRepository.findByIdWithRelations(
      SupplierReturnId.create(query.returnId),
    );
    if (!result) {
      throw new ResourceNotFoundException('SupplierReturn', query.returnId);
    }

    return SupplierReturnResponseMapper.toDetailResponse(
      result.supplierReturn,
      result.supplierName,
      result.invoiceNumber,
    );
  }
}
