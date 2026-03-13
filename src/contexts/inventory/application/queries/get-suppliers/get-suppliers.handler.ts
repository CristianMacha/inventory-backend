import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSuppliersQuery } from './get-suppliers.query';
import { ISupplierRepository } from '../../../domain/repositories/supplier.repository';
import { ISupplierOutputDto } from '../../dtos/supplier-output.dto';
import { SupplierResponseMapper } from '../../mappers/supplier-response.mapper';
import { INVENTORY_TOKENS } from '@contexts/inventory/inventory.tokens';

@QueryHandler(GetSuppliersQuery)
export class GetSuppliersHandler implements IQueryHandler<GetSuppliersQuery> {
  constructor(
    @Inject(INVENTORY_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(): Promise<ISupplierOutputDto[]> {
    const suppliers = await this.supplierRepository.findAll();
    return (suppliers ?? []).map((supplier) =>
      SupplierResponseMapper.toResponse(supplier),
    );
  }
}
