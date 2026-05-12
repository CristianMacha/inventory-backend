import { WorkshopPurchaseOrderId } from '../value-objects/workshop-purchase-order-id';
import { WorkshopPurchaseOrderItem } from './workshop-purchase-order-item';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';
import { DomainException } from '@shared/domain/domain.exception';

export class PurchaseOrderAlreadyCancelledException extends DomainException {
  constructor() {
    super('Purchase order is already cancelled');
  }
}

export class PurchaseOrderAlreadyReceivedException extends DomainException {
  constructor() {
    super('Purchase order has already been received');
  }
}

export class EmptyPurchaseOrderItemsException extends DomainException {
  constructor() {
    super('Purchase order must have at least one item');
  }
}

export class WorkshopPurchaseOrder {
  private constructor(
    private readonly _id: WorkshopPurchaseOrderId,
    private readonly _supplierId: string,
    private _status: PurchaseOrderStatus,
    private readonly _items: WorkshopPurchaseOrderItem[],
    private _notes: string | null,
    private readonly _createdBy: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(
    supplierId: string,
    items: WorkshopPurchaseOrderItem[],
    createdBy: string,
    notes?: string,
  ): WorkshopPurchaseOrder {
    if (!items || items.length === 0) {
      throw new EmptyPurchaseOrderItemsException();
    }
    const now = new Date();
    return new WorkshopPurchaseOrder(
      WorkshopPurchaseOrderId.generate(),
      supplierId,
      PurchaseOrderStatus.DRAFT,
      items,
      notes ?? null,
      createdBy,
      now,
      now,
    );
  }

  static reconstitute(
    id: WorkshopPurchaseOrderId,
    supplierId: string,
    status: PurchaseOrderStatus,
    items: WorkshopPurchaseOrderItem[],
    notes: string | null,
    createdBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): WorkshopPurchaseOrder {
    return new WorkshopPurchaseOrder(
      id,
      supplierId,
      status,
      items,
      notes,
      createdBy,
      createdAt,
      updatedAt,
    );
  }

  send(userId: string): void {
    if (this._status === PurchaseOrderStatus.CANCELLED) {
      throw new PurchaseOrderAlreadyCancelledException();
    }
    this._status = PurchaseOrderStatus.SENT;
    this._updatedAt = new Date();
  }

  receive(userId: string): void {
    if (this._status === PurchaseOrderStatus.CANCELLED) {
      throw new PurchaseOrderAlreadyCancelledException();
    }
    if (this._status === PurchaseOrderStatus.RECEIVED) {
      throw new PurchaseOrderAlreadyReceivedException();
    }
    this._status = PurchaseOrderStatus.RECEIVED;
    this._updatedAt = new Date();
  }

  cancel(userId: string): void {
    if (this._status === PurchaseOrderStatus.CANCELLED) {
      throw new PurchaseOrderAlreadyCancelledException();
    }
    this._status = PurchaseOrderStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  get id(): WorkshopPurchaseOrderId {
    return this._id;
  }

  get supplierId(): string {
    return this._supplierId;
  }

  get status(): PurchaseOrderStatus {
    return this._status;
  }

  get items(): ReadonlyArray<WorkshopPurchaseOrderItem> {
    return this._items;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get totalAmount(): number {
    return this._items.reduce((sum, item) => sum + item.totalCost, 0);
  }
}
