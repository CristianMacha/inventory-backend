import { SupplierReturn } from '../../../../domain/entities/supplier-return';
import { SupplierReturnItem } from '../../../../domain/entities/supplier-return-item';
import { SupplierReturnId } from '../../../../domain/value-objects/supplier-return-id';
import { SupplierReturnItemId } from '../../../../domain/value-objects/supplier-return-item-id';
import { SupplierReturnEntity } from '../entities/supplier-return.entity';
import { SupplierReturnItemEntity } from '../entities/supplier-return-item.entity';

function toDate(value: Date | string | null): Date | null {
  if (value == null) return null;
  return value instanceof Date ? value : new Date(value);
}

export class SupplierReturnMapper {
  static toDomain(entity: SupplierReturnEntity): SupplierReturn {
    const items = (entity.items ?? []).map((itemEntity) =>
      SupplierReturnItem.reconstitute(
        SupplierReturnItemId.create(itemEntity.id),
        SupplierReturnId.create(itemEntity.supplierReturnId),
        itemEntity.slabId,
        itemEntity.bundleId,
        itemEntity.reason,
        itemEntity.description ?? '',
        Number(itemEntity.unitCost),
        Number(itemEntity.totalCost),
      ),
    );

    return SupplierReturn.reconstitute(
      SupplierReturnId.create(entity.id),
      entity.purchaseInvoiceId,
      entity.supplierId,
      toDate(entity.returnDate)!,
      entity.status,
      entity.notes ?? '',
      items,
      Number(entity.creditAmount),
      entity.createdBy,
      entity.updatedBy,
      toDate(entity.createdAt)!,
      toDate(entity.updatedAt)!,
    );
  }

  static toPersistence(domain: SupplierReturn): SupplierReturnEntity {
    const entity = new SupplierReturnEntity();
    entity.id = domain.id.getValue();
    entity.purchaseInvoiceId = domain.purchaseInvoiceId;
    entity.supplierId = domain.supplierId;
    entity.returnDate = domain.returnDate;
    entity.status = domain.status;
    entity.notes = domain.notes;
    entity.creditAmount = domain.creditAmount;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.items = domain.items.map((item) =>
      SupplierReturnMapper.itemToPersistence(item),
    );
    return entity;
  }

  static itemToPersistence(
    domain: SupplierReturnItem,
  ): SupplierReturnItemEntity {
    const entity = new SupplierReturnItemEntity();
    entity.id = domain.id.getValue();
    entity.supplierReturnId = domain.supplierReturnId.getValue();
    entity.slabId = domain.slabId;
    entity.bundleId = domain.bundleId;
    entity.reason = domain.reason;
    entity.description = domain.description;
    entity.unitCost = domain.unitCost;
    entity.totalCost = domain.totalCost;
    return entity;
  }
}
