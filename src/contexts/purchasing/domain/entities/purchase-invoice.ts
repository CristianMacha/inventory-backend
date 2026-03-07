import { AggregateRoot } from '@nestjs/cqrs';
import { PurchaseInvoiceId } from '../value-objects/purchase-invoice-id';
import { PurchaseInvoiceStatus } from '../enums/purchase-invoice-status.enum';
import { PurchaseInvoiceItem } from './purchase-invoice-item';
import { InvoiceItemConcept } from '../enums/invoice-item-concept.enum';
import { InvalidInvoiceNumberException } from '../errors/invalid-invoice-number.exception';
import { InvalidInvoiceTransitionException } from '../errors/invalid-invoice-transition.exception';
import { EmptyInvoiceItemsException } from '../errors/empty-invoice-items.exception';
import { DuplicateBundleInInvoiceException } from '../errors/duplicate-bundle-in-invoice.exception';
import { PurchaseInvoiceCreatedEvent } from '../events/purchase-invoice-created.event';
import { PurchaseInvoiceReceivedEvent } from '../events/purchase-invoice-received.event';

export class PurchaseInvoice extends AggregateRoot {
  private readonly _id: PurchaseInvoiceId;
  private _invoiceNumber: string;
  private _supplierId: string;
  private _invoiceDate: Date;
  private _dueDate: Date | null;
  private _subtotal: number;
  private _taxAmount: number;
  private _totalAmount: number;
  private _status: PurchaseInvoiceStatus;
  private _paidAmount: number;
  private _notes: string;
  private _documentPath: string | null;
  private _items: PurchaseInvoiceItem[];
  private _itemCount: number | null;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: PurchaseInvoiceId,
    invoiceNumber: string,
    supplierId: string,
    invoiceDate: Date,
    dueDate: Date | null,
    subtotal: number,
    taxAmount: number,
    totalAmount: number,
    status: PurchaseInvoiceStatus,
    paidAmount: number,
    notes: string,
    documentPath: string | null,
    items: PurchaseInvoiceItem[],
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this._id = id;
    this._invoiceNumber = invoiceNumber;
    this._supplierId = supplierId;
    this._invoiceDate = invoiceDate;
    this._dueDate = dueDate;
    this._subtotal = subtotal;
    this._taxAmount = taxAmount;
    this._totalAmount = totalAmount;
    this._status = status;
    this._paidAmount = paidAmount;
    this._notes = notes;
    this._documentPath = documentPath;
    this._items = items;
    this._itemCount = null;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateInvoiceNumber(invoiceNumber: string): void {
    if (!invoiceNumber || invoiceNumber.trim().length === 0) {
      throw new InvalidInvoiceNumberException();
    }
  }

  static create(
    invoiceNumber: string,
    supplierId: string,
    invoiceDate: Date,
    dueDate: Date | null,
    notes: string,
    createdBy: string,
  ): PurchaseInvoice {
    PurchaseInvoice.validateInvoiceNumber(invoiceNumber);
    const now = new Date();
    const invoice = new PurchaseInvoice(
      PurchaseInvoiceId.generate(),
      invoiceNumber,
      supplierId,
      invoiceDate,
      dueDate,
      0,
      0,
      0,
      PurchaseInvoiceStatus.DRAFT,
      0,
      notes,
      null,
      [],
      createdBy,
      createdBy,
      now,
      now,
    );
    invoice.apply(
      new PurchaseInvoiceCreatedEvent(
        invoice._id.getValue(),
        invoiceNumber,
        supplierId,
        createdBy,
      ),
    );
    return invoice;
  }

  static reconstitute(
    id: PurchaseInvoiceId,
    invoiceNumber: string,
    supplierId: string,
    invoiceDate: Date,
    dueDate: Date | null,
    subtotal: number,
    taxAmount: number,
    totalAmount: number,
    status: PurchaseInvoiceStatus,
    paidAmount: number,
    notes: string,
    documentPath: string | null,
    items: PurchaseInvoiceItem[],
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): PurchaseInvoice {
    return new PurchaseInvoice(
      id,
      invoiceNumber,
      supplierId,
      invoiceDate,
      dueDate,
      subtotal,
      taxAmount,
      totalAmount,
      status,
      paidAmount,
      notes,
      documentPath,
      items,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public addItem(
    bundleId: string,
    concept: InvoiceItemConcept,
    description: string,
    unitCost: number,
    quantity: number,
    userId: string,
  ): PurchaseInvoiceItem {
    const alreadyExists = this._items.some(
      (item) => item.bundleId === bundleId,
    );
    if (alreadyExists) {
      throw new DuplicateBundleInInvoiceException(bundleId);
    }
    const item = PurchaseInvoiceItem.create(
      this._id,
      bundleId,
      concept,
      description,
      unitCost,
      quantity,
    );
    this._items.push(item);
    this.recalculateTotals();
    this._updatedBy = userId;
    this._updatedAt = new Date();
    return item;
  }

  public removeItem(itemId: string, userId: string): string | null {
    const item = this._items.find((i) => i.id.getValue() === itemId);
    this._items = this._items.filter((i) => i.id.getValue() !== itemId);
    this.recalculateTotals();
    this._updatedBy = userId;
    this._updatedAt = new Date();
    return item?.bundleId ?? null;
  }

  public receive(userId: string): void {
    if (this._status !== PurchaseInvoiceStatus.DRAFT) {
      throw new InvalidInvoiceTransitionException(
        this._status,
        PurchaseInvoiceStatus.RECEIVED,
      );
    }
    if (this._items.length === 0) {
      throw new EmptyInvoiceItemsException();
    }
    this._status = PurchaseInvoiceStatus.RECEIVED;
    this._updatedBy = userId;
    this._updatedAt = new Date();
    this.apply(
      new PurchaseInvoiceReceivedEvent(
        this._id.getValue(),
        this._supplierId,
        this._items.map((item) => item.bundleId),
      ),
    );
  }

  public pay(userId: string): void {
    if (
      this._status !== PurchaseInvoiceStatus.RECEIVED &&
      this._status !== PurchaseInvoiceStatus.PARTIALLY_PAID
    ) {
      throw new InvalidInvoiceTransitionException(
        this._status,
        PurchaseInvoiceStatus.PAID,
      );
    }
    this._status = PurchaseInvoiceStatus.PAID;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public cancel(userId: string): void {
    if (this._status === PurchaseInvoiceStatus.PAID) {
      throw new InvalidInvoiceTransitionException(
        this._status,
        PurchaseInvoiceStatus.CANCELLED,
      );
    }
    this._status = PurchaseInvoiceStatus.CANCELLED;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateTaxAmount(taxAmount: number, userId: string): void {
    this._taxAmount = taxAmount;
    this._totalAmount = this._subtotal + this._taxAmount;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateNotes(notes: string, userId: string): void {
    this._notes = notes;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public attachDocument(path: string, userId: string): void {
    this._documentPath = path;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateDueDate(dueDate: Date | null, userId: string): void {
    this._dueDate = dueDate;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  private recalculateTotals(): void {
    this._subtotal = this._items.reduce((sum, item) => sum + item.totalCost, 0);
    this._totalAmount = this._subtotal + this._taxAmount;
  }

  public applyPayment(amount: number, userId: string): void {
    this._paidAmount += amount;
    this._status =
      this._paidAmount >= this._totalAmount
        ? PurchaseInvoiceStatus.PAID
        : PurchaseInvoiceStatus.PARTIALLY_PAID;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): PurchaseInvoiceId {
    return this._id;
  }
  get invoiceNumber(): string {
    return this._invoiceNumber;
  }
  get supplierId(): string {
    return this._supplierId;
  }
  get invoiceDate(): Date {
    return this._invoiceDate;
  }
  get dueDate(): Date | null {
    return this._dueDate;
  }
  get subtotal(): number {
    return this._subtotal;
  }
  get taxAmount(): number {
    return this._taxAmount;
  }
  get totalAmount(): number {
    return this._totalAmount;
  }
  get status(): PurchaseInvoiceStatus {
    return this._status;
  }
  get paidAmount(): number {
    return this._paidAmount;
  }
  get notes(): string {
    return this._notes;
  }
  get documentPath(): string | null {
    return this._documentPath;
  }
  get items(): ReadonlyArray<PurchaseInvoiceItem> {
    return this._items;
  }
  get itemCount(): number {
    return this._itemCount ?? this._items.length;
  }
  setItemCount(count: number): void {
    this._itemCount = count;
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
