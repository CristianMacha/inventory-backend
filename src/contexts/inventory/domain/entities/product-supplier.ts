import { ProductSupplierId } from '../value-objects/product-supplier-id';
import { ProductId } from '../value-objects/product-id';
import { SupplierId } from '../value-objects/supplier-id';

export class ProductSupplier {
  private readonly _id: ProductSupplierId;
  private readonly _productId: ProductId;
  private readonly _supplierId: SupplierId;
  private _isPrimary: boolean;

  private constructor(
    id: ProductSupplierId,
    productId: ProductId,
    supplierId: SupplierId,
    isPrimary: boolean,
  ) {
    this._id = id;
    this._productId = productId;
    this._supplierId = supplierId;
    this._isPrimary = isPrimary;
  }

  static create(
    productId: ProductId,
    supplierId: SupplierId,
    isPrimary: boolean,
  ): ProductSupplier {
    return new ProductSupplier(
      ProductSupplierId.generate(),
      productId,
      supplierId,
      isPrimary,
    );
  }

  static reconstitute(
    id: ProductSupplierId,
    productId: ProductId,
    supplierId: SupplierId,
    isPrimary: boolean,
  ): ProductSupplier {
    return new ProductSupplier(id, productId, supplierId, isPrimary);
  }

  setPrimary(isPrimary: boolean): void {
    this._isPrimary = isPrimary;
  }

  get id(): ProductSupplierId {
    return this._id;
  }

  get productId(): ProductId {
    return this._productId;
  }

  get supplierId(): SupplierId {
    return this._supplierId;
  }

  get isPrimary(): boolean {
    return this._isPrimary;
  }
}
