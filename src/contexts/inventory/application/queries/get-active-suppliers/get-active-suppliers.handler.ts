import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetActiveSuppliersQuery } from './get-active-suppliers.query';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { ISupplierOutputDto } from '../../dtos/supplier-output.dto';
import { SupplierResponseMapper } from '../../mappers/supplier-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetActiveSuppliersQuery)
export class GetActiveSuppliersHandler implements IQueryHandler<GetActiveSuppliersQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(): Promise<ISupplierOutputDto[]> {
    const suppliers = await this.supplierRepository.findAllActive();
    return suppliers.map((s) => SupplierResponseMapper.toResponse(s));
  }
}
