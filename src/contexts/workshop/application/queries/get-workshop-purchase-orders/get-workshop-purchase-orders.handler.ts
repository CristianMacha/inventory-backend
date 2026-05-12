import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWorkshopPurchaseOrdersQuery } from './get-workshop-purchase-orders.query';
import { IWorkshopPurchaseOrderRepository } from '../../../domain/repositories/iworkshop-purchase-order.repository';
import { IWorkshopSupplierRepository } from '../../../domain/repositories/iworkshop-supplier.repository';
import { WorkshopSupplierId } from '../../../domain/value-objects/workshop-supplier-id';
import { WorkshopPurchaseOrderDto } from '../../dtos/workshop-purchase-order.dto';
import { WorkshopPurchaseOrderMapper } from '../../mappers/workshop-purchase-order.mapper';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { WORKSHOP_TOKENS } from '@contexts/workshop/workshop.tokens';

@QueryHandler(GetWorkshopPurchaseOrdersQuery)
export class GetWorkshopPurchaseOrdersHandler implements IQueryHandler<GetWorkshopPurchaseOrdersQuery> {
  constructor(
    @Inject(WORKSHOP_TOKENS.PURCHASE_ORDER_REPOSITORY)
    private readonly repository: IWorkshopPurchaseOrderRepository,
    @Inject(WORKSHOP_TOKENS.SUPPLIER_REPOSITORY)
    private readonly supplierRepository: IWorkshopSupplierRepository,
  ) {}

  async execute(
    query: GetWorkshopPurchaseOrdersQuery,
  ): Promise<PaginatedResult<WorkshopPurchaseOrderDto>> {
    const result = await this.repository.findAll(
      query.filter,
      query.pagination,
    );

    // Batch-resolve unique supplier names
    const supplierIds = new Set(result.data.map((o) => o.supplierId));
    const supplierNames = new Map<string, string>();
    await Promise.all(
      [...supplierIds].map(async (id) => {
        const supplier = await this.supplierRepository.findById(
          WorkshopSupplierId.create(id),
        );
        if (supplier) supplierNames.set(id, supplier.name);
      }),
    );

    return {
      ...result,
      data: result.data.map((order) =>
        WorkshopPurchaseOrderMapper.toDto(
          order,
          supplierNames.get(order.supplierId) ?? order.supplierId,
        ),
      ),
    };
  }
}
