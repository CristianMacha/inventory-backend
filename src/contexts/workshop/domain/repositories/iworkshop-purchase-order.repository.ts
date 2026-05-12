import { WorkshopPurchaseOrder } from '../entities/workshop-purchase-order.entity';
import { WorkshopPurchaseOrderId } from '../value-objects/workshop-purchase-order-id';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';

export interface FindPurchaseOrdersFilter {
  status?: PurchaseOrderStatus;
  supplierId?: string;
}

export interface IWorkshopPurchaseOrderRepository {
  findAll(
    filter: FindPurchaseOrdersFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<WorkshopPurchaseOrder>>;
  findById(id: WorkshopPurchaseOrderId): Promise<WorkshopPurchaseOrder | null>;
  /** Returns a map of materialId → total purchaseQuantity across DRAFT and SENT orders */
  findActivePurchaseQuantityByMaterial(): Promise<Map<string, number>>;
  save(order: WorkshopPurchaseOrder): Promise<void>;
}
