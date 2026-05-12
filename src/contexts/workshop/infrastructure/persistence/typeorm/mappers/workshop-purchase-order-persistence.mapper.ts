import { v4 as uuidv4 } from 'uuid';
import { WorkshopPurchaseOrder } from '../../../../domain/entities/workshop-purchase-order.entity';
import { WorkshopPurchaseOrderItem } from '../../../../domain/entities/workshop-purchase-order-item';
import { WorkshopPurchaseOrderId } from '../../../../domain/value-objects/workshop-purchase-order-id';
import { WorkshopPurchaseOrderTypeormEntity } from '../entities/workshop-purchase-order.typeorm.entity';
import { WorkshopPurchaseOrderItemTypeormEntity } from '../entities/workshop-purchase-order-item.typeorm.entity';

export class WorkshopPurchaseOrderPersistenceMapper {
  static toDomain(
    entity: WorkshopPurchaseOrderTypeormEntity,
  ): WorkshopPurchaseOrder {
    const items = (entity.items ?? []).map((i) =>
      WorkshopPurchaseOrderItem.reconstitute(
        i.materialId,
        i.materialName,
        Number(i.purchaseQuantity),
        Number(i.requestedQuantity),
        Number(i.unitCost),
      ),
    );

    return WorkshopPurchaseOrder.reconstitute(
      WorkshopPurchaseOrderId.create(entity.id),
      entity.supplierId,
      entity.status,
      items,
      entity.notes,
      entity.createdBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(
    domain: WorkshopPurchaseOrder,
  ): WorkshopPurchaseOrderTypeormEntity {
    const entity = new WorkshopPurchaseOrderTypeormEntity();
    entity.id = domain.id.getValue();
    entity.supplierId = domain.supplierId;
    entity.status = domain.status;
    entity.notes = domain.notes;
    entity.createdBy = domain.createdBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    entity.items = domain.items.map((item) => {
      const itemEntity = new WorkshopPurchaseOrderItemTypeormEntity();
      itemEntity.id = uuidv4();
      itemEntity.purchaseOrderId = domain.id.getValue();
      itemEntity.materialId = item.materialId;
      itemEntity.materialName = item.materialName;
      itemEntity.purchaseQuantity = item.purchaseQuantity;
      itemEntity.requestedQuantity = item.requestedQuantity;
      itemEntity.unitCost = item.unitCost;
      return itemEntity;
    });

    return entity;
  }
}
