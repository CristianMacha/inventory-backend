import { BundleId } from '../value-objects/bundle-id';
import { ProductId } from '../value-objects/product-id';
import { SupplierId } from '../value-objects/supplier-id';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';
import { InvalidThicknessException } from '../errors/invalid-thickness.exception';
import { BundleAlreadyLinkedToInvoiceException } from '../errors/bundle-already-linked-to-invoice.exception';
import { BundleNotLinkedToInvoiceException } from '../errors/bundle-not-linked-to-invoice.exception';

export class Bundle {
  private readonly _id: BundleId;
  private readonly _productId: ProductId;
  private readonly _supplierId: SupplierId;
  private _lotNumber: string;
  private _thicknessCm: number;
  private _purchaseInvoiceId: string | null;
  private _imagePublicId: string | null;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: BundleId,
    productId: ProductId,
    supplierId: SupplierId,
    lotNumber: string,
    thicknessCm: number,
    purchaseInvoiceId: string | null,
    imagePublicId: string | null,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._productId = productId;
    this._supplierId = supplierId;
    this._lotNumber = lotNumber;
    this._thicknessCm = thicknessCm;
    this._purchaseInvoiceId = purchaseInvoiceId;
    this._imagePublicId = imagePublicId;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateLotNumber(lotNumber: string): void {
    if (!lotNumber || lotNumber.trim().length === 0) {
      throw new InvalidEntityNameException('Bundle lot number');
    }
  }

  private static validateThickness(thicknessCm: number): void {
    if (thicknessCm <= 0) {
      throw new InvalidThicknessException();
    }
  }

  static create(
    productId: ProductId,
    supplierId: SupplierId,
    lotNumber: string,
    thicknessCm: number,
    createdBy: string,
    purchaseInvoiceId: string | null = null,
  ): Bundle {
    Bundle.validateLotNumber(lotNumber);
    Bundle.validateThickness(thicknessCm);
    const now = new Date();
    return new Bundle(
      BundleId.generate(),
      productId,
      supplierId,
      lotNumber,
      thicknessCm,
      purchaseInvoiceId,
      null,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  static reconstitute(
    id: BundleId,
    productId: ProductId,
    supplierId: SupplierId,
    lotNumber: string,
    thicknessCm: number,
    purchaseInvoiceId: string | null,
    imagePublicId: string | null,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Bundle {
    return new Bundle(
      id,
      productId,
      supplierId,
      lotNumber,
      thicknessCm,
      purchaseInvoiceId,
      imagePublicId,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public updateLotNumber(lotNumber: string, userId: string): void {
    Bundle.validateLotNumber(lotNumber);
    this._lotNumber = lotNumber;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateThicknessCm(thicknessCm: number, userId: string): void {
    Bundle.validateThickness(thicknessCm);
    this._thicknessCm = thicknessCm;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public linkInvoice(invoiceId: string, userId: string): void {
    if (this._purchaseInvoiceId !== null) {
      throw new BundleAlreadyLinkedToInvoiceException(
        this._id.getValue(),
        this._purchaseInvoiceId,
      );
    }
    this._purchaseInvoiceId = invoiceId;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateImagePublicId(publicId: string | null, userId: string): void {
    this._imagePublicId = publicId;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public unlinkInvoice(userId: string): void {
    if (this._purchaseInvoiceId === null) {
      throw new BundleNotLinkedToInvoiceException(this._id.getValue());
    }
    this._purchaseInvoiceId = null;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): BundleId {
    return this._id;
  }
  get productId(): ProductId {
    return this._productId;
  }
  get supplierId(): SupplierId {
    return this._supplierId;
  }
  get lotNumber(): string {
    return this._lotNumber;
  }
  get thicknessCm(): number {
    return this._thicknessCm;
  }
  get purchaseInvoiceId(): string | null {
    return this._purchaseInvoiceId;
  }
  get imagePublicId(): string | null {
    return this._imagePublicId;
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
