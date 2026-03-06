import { AggregateRoot } from '@nestjs/cqrs';
import { SupplierReturnId } from '../value-objects/supplier-return-id';
import { SupplierReturnStatus } from '../enums/supplier-return-status.enum';
import { ReturnReason } from '../enums/return-reason.enum';
import { SupplierReturnItem } from './supplier-return-item';
import { InvalidReturnTransitionException } from '../errors/invalid-return-transition.exception';
import { EmptyReturnItemsException } from '../errors/empty-return-items.exception';
import { DuplicateSlabInReturnException } from '../errors/duplicate-slab-in-return.exception';
import { SupplierReturnCreatedEvent } from '../events/supplier-return-created.event';
import { SupplierReturnCreditedEvent } from '../events/supplier-return-credited.event';

export class SupplierReturn extends AggregateRoot {
  private readonly _id: SupplierReturnId;
  private readonly _purchaseInvoiceId: string;
  private readonly _supplierId: string;
  private _returnDate: Date;
  private _status: SupplierReturnStatus;
  private _notes: string;
  private _documentPath: string | null;
  private _items: SupplierReturnItem[];
  private _creditAmount: number;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: SupplierReturnId,
    purchaseInvoiceId: string,
    supplierId: string,
    returnDate: Date,
    status: SupplierReturnStatus,
    notes: string,
    documentPath: string | null,
    items: SupplierReturnItem[],
    creditAmount: number,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this._id = id;
    this._purchaseInvoiceId = purchaseInvoiceId;
    this._supplierId = supplierId;
    this._returnDate = returnDate;
    this._status = status;
    this._notes = notes;
    this._documentPath = documentPath;
    this._items = items;
    this._creditAmount = creditAmount;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(
    purchaseInvoiceId: string,
    supplierId: string,
    returnDate: Date,
    notes: string,
    createdBy: string,
  ): SupplierReturn {
    const now = new Date();
    const returnDoc = new SupplierReturn(
      SupplierReturnId.generate(),
      purchaseInvoiceId,
      supplierId,
      returnDate,
      SupplierReturnStatus.DRAFT,
      notes,
      null,
      [],
      0,
      createdBy,
      createdBy,
      now,
      now,
    );
    returnDoc.apply(
      new SupplierReturnCreatedEvent(
        returnDoc._id.getValue(),
        purchaseInvoiceId,
        supplierId,
        createdBy,
      ),
    );
    return returnDoc;
  }

  static reconstitute(
    id: SupplierReturnId,
    purchaseInvoiceId: string,
    supplierId: string,
    returnDate: Date,
    status: SupplierReturnStatus,
    notes: string,
    documentPath: string | null,
    items: SupplierReturnItem[],
    creditAmount: number,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): SupplierReturn {
    return new SupplierReturn(
      id,
      purchaseInvoiceId,
      supplierId,
      returnDate,
      status,
      notes,
      documentPath,
      items,
      creditAmount,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public addItem(
    slabId: string,
    bundleId: string,
    reason: ReturnReason,
    description: string,
    unitCost: number,
    userId: string,
  ): SupplierReturnItem {
    const alreadyExists = this._items.some((item) => item.slabId === slabId);
    if (alreadyExists) {
      throw new DuplicateSlabInReturnException(slabId);
    }
    const item = SupplierReturnItem.create(
      this._id,
      slabId,
      bundleId,
      reason,
      description,
      unitCost,
    );
    this._items.push(item);
    this.recalculateCreditAmount();
    this._updatedBy = userId;
    this._updatedAt = new Date();
    return item;
  }

  public removeItem(itemId: string, userId: string): void {
    this._items = this._items.filter((item) => item.id.getValue() !== itemId);
    this.recalculateCreditAmount();
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public send(userId: string): void {
    if (this._status !== SupplierReturnStatus.DRAFT) {
      throw new InvalidReturnTransitionException(
        this._status,
        SupplierReturnStatus.SENT,
      );
    }
    if (this._items.length === 0) {
      throw new EmptyReturnItemsException();
    }
    this._status = SupplierReturnStatus.SENT;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public credit(userId: string): void {
    if (this._status !== SupplierReturnStatus.SENT) {
      throw new InvalidReturnTransitionException(
        this._status,
        SupplierReturnStatus.CREDITED,
      );
    }
    this._status = SupplierReturnStatus.CREDITED;
    this._updatedBy = userId;
    this._updatedAt = new Date();
    this.apply(
      new SupplierReturnCreditedEvent(
        this._id.getValue(),
        this._items.map((item) => item.slabId),
      ),
    );
  }

  public attachDocument(path: string, userId: string): void {
    this._documentPath = path;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public cancel(userId: string): void {
    if (this._status === SupplierReturnStatus.CREDITED) {
      throw new InvalidReturnTransitionException(
        this._status,
        SupplierReturnStatus.CANCELLED,
      );
    }
    this._status = SupplierReturnStatus.CANCELLED;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  private recalculateCreditAmount(): void {
    this._creditAmount = this._items.reduce(
      (sum, item) => sum + item.totalCost,
      0,
    );
  }

  get id(): SupplierReturnId {
    return this._id;
  }
  get purchaseInvoiceId(): string {
    return this._purchaseInvoiceId;
  }
  get supplierId(): string {
    return this._supplierId;
  }
  get returnDate(): Date {
    return this._returnDate;
  }
  get status(): SupplierReturnStatus {
    return this._status;
  }
  get notes(): string {
    return this._notes;
  }
  get documentPath(): string | null {
    return this._documentPath;
  }
  get items(): ReadonlyArray<SupplierReturnItem> {
    return this._items;
  }
  get creditAmount(): number {
    return this._creditAmount;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  get updatedBy(): string {
    return this._updatedBy;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
