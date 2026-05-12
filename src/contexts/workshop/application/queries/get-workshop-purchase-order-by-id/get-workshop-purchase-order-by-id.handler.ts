import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetWorkshopPurchaseOrderByIdQuery } from './get-workshop-purchase-order-by-id.query';
import { IWorkshopPurchaseOrderRepository } from '../../../domain/repositories/iworkshop-purchase-order.repository';
import { IWorkshopSupplierRepository } from '../../../domain/repositories/iworkshop-supplier.repository';
import { WorkshopPurchaseOrderId } from '../../../domain/value-objects/workshop-purchase-order-id';
import { WorkshopSupplierId } from '../../../domain/value-objects/workshop-supplier-id';
import { WorkshopPurchaseOrderDto } from '../../dtos/workshop-purchase-order.dto';
import { WorkshopPurchaseOrderMapper } from '../../mappers/workshop-purchase-order.mapper';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetWorkshopPurchaseOrderByIdQuery)
export class GetWorkshopPurchaseOrderByIdHandler implements IQueryHandler<GetWorkshopPurchaseOrderByIdQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.PURCHASE_ORDER_REPOSITORY)
    private readonly repository: IWorkshopPurchaseOrderRepository,
    @Inject(WORKSHOP_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: IWorkshopSupplierRepository,
  ) {}

  async execute(
    query: GetWorkshopPurchaseOrderByIdQuery,
  ): Promise<WorkshopPurchaseOrderDto> {
    const order = await this.repository.findById(
      WorkshopPurchaseOrderId.create(query.id),
    );
    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    const supplier = await this.supplierRepository.findById(
      WorkshopSupplierId.create(order.supplierId),
    );

    return WorkshopPurchaseOrderMapper.toDto(
      order,
      supplier?.name ?? order.supplierId,
    );
  }
}
