import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetSupplierByIdQuery } from './get-supplier-by-id.query';
import { ISupplierRepository } from '@contexts/inventory/domain/repositories/supplier.repository';
import { ISupplierOutputDto } from '@contexts/inventory/application/dtos/supplier-output.dto';
import { SupplierResponseMapper } from '@contexts/inventory/application/mappers/supplier-response.mapper';
import { SupplierId } from '@contexts/inventory/domain/value-objects/supplier-id';
import { ResourceNotFoundException } from '@shared/domain/exceptions/resource-not-found.exception';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetSupplierByIdQuery)
export class GetSupplierByIdHandler implements IQueryHandler<GetSupplierByIdQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(query: GetSupplierByIdQuery): Promise<ISupplierOutputDto> {
    const supplier = await this.supplierRepository.findById(
      SupplierId.create(query.id),
    );
    if (!supplier) {
      throw new ResourceNotFoundException('Supplier', query.id);
    }
    return SupplierResponseMapper.toResponse(supplier);
  }
}
