import { WorkshopPurchaseOrder } from '../../domain/entities/workshop-purchase-order.entity';
import {
  WorkshopPurchaseOrderDto,
  WorkshopPurchaseOrderItemDto,
} from '../dtos/workshop-purchase-order.dto';

export class WorkshopPurchaseOrderMapper {
  static toDto(
    order: WorkshopPurchaseOrder,
    supplierName: string,
  ): WorkshopPurchaseOrderDto {
    const items: WorkshopPurchaseOrderItemDto[] = order.items.map((item) => ({
      materialId: item.materialId,
      materialName: item.materialName,
      purchaseQuantity: item.purchaseQuantity,
      requestedQuantity: item.requestedQuantity,
      unitCost: item.unitCost,
      totalCost: item.totalCost,
    }));

    return {
      id: order.id.getValue(),
      supplierId: order.supplierId,
      supplierName,
      status: order.status,
      items,
      notes: order.notes,
      totalAmount: order.totalAmount,
      createdBy: order.createdBy,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
