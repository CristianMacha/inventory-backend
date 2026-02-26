import { SupplierReturnItemId } from '../value-objects/supplier-return-item-id';
import { SupplierReturnId } from '../value-objects/supplier-return-id';
import { ReturnReason } from '../enums/return-reason.enum';

export class SupplierReturnItem {
  private constructor(
    private readonly _id: SupplierReturnItemId,
    private readonly _supplierReturnId: SupplierReturnId,
    private readonly _slabId: string,
    private readonly _bundleId: string,
    private readonly _reason: ReturnReason,
    private readonly _description: string,
    private readonly _unitCost: number,
    private readonly _totalCost: number,
  ) {}

  static create(
    supplierReturnId: SupplierReturnId,
    slabId: string,
    bundleId: string,
    reason: ReturnReason,
    description: string,
    unitCost: number,
  ): SupplierReturnItem {
    return new SupplierReturnItem(
      SupplierReturnItemId.generate(),
      supplierReturnId,
      slabId,
      bundleId,
      reason,
      description,
      unitCost,
      unitCost, // 1 slab = 1 unit
    );
  }

  static reconstitute(
    id: SupplierReturnItemId,
    supplierReturnId: SupplierReturnId,
    slabId: string,
    bundleId: string,
    reason: ReturnReason,
    description: string,
    unitCost: number,
    totalCost: number,
  ): SupplierReturnItem {
    return new SupplierReturnItem(
      id,
      supplierReturnId,
      slabId,
      bundleId,
      reason,
      description,
      unitCost,
      totalCost,
    );
  }

  get id(): SupplierReturnItemId {
    return this._id;
  }
  get supplierReturnId(): SupplierReturnId {
    return this._supplierReturnId;
  }
  get slabId(): string {
    return this._slabId;
  }
  get bundleId(): string {
    return this._bundleId;
  }
  get reason(): ReturnReason {
    return this._reason;
  }
  get description(): string {
    return this._description;
  }
  get unitCost(): number {
    return this._unitCost;
  }
  get totalCost(): number {
    return this._totalCost;
  }
}
