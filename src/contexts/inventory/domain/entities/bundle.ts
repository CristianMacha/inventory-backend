import { BundleId } from '../value-objects/bundle-id';
import { ProductId } from '../value-objects/product-id';
import { SupplierId } from '../value-objects/supplier-id';

export class Bundle {
  private readonly _id: BundleId;
  private readonly _productId: ProductId;
  private readonly _supplierId: SupplierId;
  private _lotNumber: string;
  private _thicknessCm: number;
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
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(
    productId: ProductId,
    supplierId: SupplierId,
    lotNumber: string,
    thicknessCm: number,
    createdBy: string,
  ): Bundle {
    const now = new Date();
    return new Bundle(
      BundleId.generate(),
      productId,
      supplierId,
      lotNumber,
      thicknessCm,
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
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public updateLotNumber(lotNumber: string, userId: string): void {
    this._lotNumber = lotNumber;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateThicknessCm(thicknessCm: number, userId: string): void {
    this._thicknessCm = thicknessCm;
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
