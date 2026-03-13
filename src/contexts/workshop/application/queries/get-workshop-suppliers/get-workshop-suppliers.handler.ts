import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWorkshopSuppliersQuery } from './get-workshop-suppliers.query';
import { IWorkshopSupplierRepository } from '../../../domain/repositories/iworkshop-supplier.repository';
import { WorkshopSupplierDto } from '../../dtos/workshop-supplier.dto';
import { WorkshopSupplierMapper } from '../../mappers/workshop-supplier.mapper';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetWorkshopSuppliersQuery)
export class GetWorkshopSuppliersHandler implements IQueryHandler<GetWorkshopSuppliersQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: IWorkshopSupplierRepository,
  ) {}

  async execute(): Promise<WorkshopSupplierDto[]> {
    const suppliers = await this.supplierRepository.findAll();
    return suppliers.map((e) => WorkshopSupplierMapper.toDto(e));
  }
}
