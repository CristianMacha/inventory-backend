import { PurchaseInvoiceItemId } from '../value-objects/purchase-invoice-item-id';
import { PurchaseInvoiceId } from '../value-objects/purchase-invoice-id';
import { InvoiceItemConcept } from '../enums/invoice-item-concept.enum';

export class PurchaseInvoiceItem {
  private readonly _id: PurchaseInvoiceItemId;
  private readonly _purchaseInvoiceId: PurchaseInvoiceId;
  private _bundleId: string;
  private _concept: InvoiceItemConcept;
  private _description: string;
  private _unitCost: number;
  private _quantity: number;
  private _totalCost: number;

  private constructor(
    id: PurchaseInvoiceItemId,
    purchaseInvoiceId: PurchaseInvoiceId,
    bundleId: string,
    concept: InvoiceItemConcept,
    description: string,
    unitCost: number,
    quantity: number,
    totalCost: number,
  ) {
    this._id = id;
    this._purchaseInvoiceId = purchaseInvoiceId;
    this._bundleId = bundleId;
    this._concept = concept;
    this._description = description;
    this._unitCost = unitCost;
    this._quantity = quantity;
    this._totalCost = totalCost;
  }

  static create(
    purchaseInvoiceId: PurchaseInvoiceId,
    bundleId: string,
    concept: InvoiceItemConcept,
    description: string,
    unitCost: number,
    quantity: number,
  ): PurchaseInvoiceItem {
    const totalCost = unitCost * quantity;
    return new PurchaseInvoiceItem(
      PurchaseInvoiceItemId.generate(),
      purchaseInvoiceId,
      bundleId,
      concept,
      description,
      unitCost,
      quantity,
      totalCost,
    );
  }

  static reconstitute(
    id: PurchaseInvoiceItemId,
    purchaseInvoiceId: PurchaseInvoiceId,
    bundleId: string,
    concept: InvoiceItemConcept,
    description: string,
    unitCost: number,
    quantity: number,
    totalCost: number,
  ): PurchaseInvoiceItem {
    return new PurchaseInvoiceItem(
      id,
      purchaseInvoiceId,
      bundleId,
      concept,
      description,
      unitCost,
      quantity,
      totalCost,
    );
  }

  get id(): PurchaseInvoiceItemId {
    return this._id;
  }

  get purchaseInvoiceId(): PurchaseInvoiceId {
    return this._purchaseInvoiceId;
  }

  get bundleId(): string {
    return this._bundleId;
  }

  get concept(): InvoiceItemConcept {
    return this._concept;
  }

  get description(): string {
    return this._description;
  }

  get unitCost(): number {
    return this._unitCost;
  }

  get quantity(): number {
    return this._quantity;
  }

  get totalCost(): number {
    return this._totalCost;
  }
}
