import { PurchaseInvoice } from '../../../../domain/entities/purchase-invoice';
import { PurchaseInvoiceItem } from '../../../../domain/entities/purchase-invoice-item';
import { PurchaseInvoiceId } from '../../../../domain/value-objects/purchase-invoice-id';
import { PurchaseInvoiceItemId } from '../../../../domain/value-objects/purchase-invoice-item-id';
import { PurchaseInvoiceEntity } from '../entities/purchase-invoice.entity';
import { PurchaseInvoiceItemEntity } from '../entities/purchase-invoice-item.entity';

function toDate(value: Date | string | null): Date | null {
  if (value == null) return null;
  return value instanceof Date ? value : new Date(value);
}

export class PurchaseInvoiceMapper {
  static toDomain(entity: PurchaseInvoiceEntity): PurchaseInvoice {
    const items = (entity.items ?? []).map((itemEntity) =>
      PurchaseInvoiceItem.reconstitute(
        PurchaseInvoiceItemId.create(itemEntity.id),
        PurchaseInvoiceId.create(itemEntity.purchaseInvoiceId),
        itemEntity.bundleId,
        itemEntity.concept,
        itemEntity.description ?? '',
        Number(itemEntity.unitCost),
        itemEntity.quantity,
        Number(itemEntity.totalCost),
      ),
    );

    return PurchaseInvoice.reconstitute(
      PurchaseInvoiceId.create(entity.id),
      entity.invoiceNumber,
      entity.supplierId,
      toDate(entity.invoiceDate)!,
      toDate(entity.dueDate),
      Number(entity.subtotal),
      Number(entity.taxAmount),
      Number(entity.totalAmount),
      entity.status,
      entity.notes ?? '',
      items,
      entity.createdBy,
      entity.updatedBy,
      toDate(entity.createdAt)!,
      toDate(entity.updatedAt)!,
    );
  }

  static toPersistence(domain: PurchaseInvoice): PurchaseInvoiceEntity {
    const entity = new PurchaseInvoiceEntity();
    entity.id = domain.id.getValue();
    entity.invoiceNumber = domain.invoiceNumber;
    entity.supplierId = domain.supplierId;
    entity.invoiceDate = domain.invoiceDate;
    entity.dueDate = domain.dueDate;
    entity.subtotal = domain.subtotal;
    entity.taxAmount = domain.taxAmount;
    entity.totalAmount = domain.totalAmount;
    entity.status = domain.status;
    entity.notes = domain.notes;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.items = domain.items.map((item) =>
      PurchaseInvoiceMapper.itemToPersistence(item),
    );
    return entity;
  }

  static itemToPersistence(
    domain: PurchaseInvoiceItem,
  ): PurchaseInvoiceItemEntity {
    const entity = new PurchaseInvoiceItemEntity();
    entity.id = domain.id.getValue();
    entity.purchaseInvoiceId = domain.purchaseInvoiceId.getValue();
    entity.bundleId = domain.bundleId;
    entity.concept = domain.concept;
    entity.description = domain.description;
    entity.unitCost = domain.unitCost;
    entity.quantity = domain.quantity;
    entity.totalCost = domain.totalCost;
    return entity;
  }
}
