export class WorkshopPurchaseOrderItem {
  private constructor(
    private readonly _materialId: string,
    private readonly _materialName: string,
    private _purchaseQuantity: number,
    private readonly _requestedQuantity: number,
    private _unitCost: number,
  ) {}

  static create(
    materialId: string,
    materialName: string,
    purchaseQuantity: number,
    requestedQuantity: number,
    unitCost: number,
  ): WorkshopPurchaseOrderItem {
    return new WorkshopPurchaseOrderItem(
      materialId,
      materialName,
      purchaseQuantity,
      requestedQuantity,
      unitCost,
    );
  }

  static reconstitute(
    materialId: string,
    materialName: string,
    purchaseQuantity: number,
    requestedQuantity: number,
    unitCost: number,
  ): WorkshopPurchaseOrderItem {
    return new WorkshopPurchaseOrderItem(
      materialId,
      materialName,
      purchaseQuantity,
      requestedQuantity,
      unitCost,
    );
  }

  get materialId(): string {
    return this._materialId;
  }

  get materialName(): string {
    return this._materialName;
  }

  get purchaseQuantity(): number {
    return this._purchaseQuantity;
  }

  get requestedQuantity(): number {
    return this._requestedQuantity;
  }

  get unitCost(): number {
    return this._unitCost;
  }

  get totalCost(): number {
    return this._purchaseQuantity * this._unitCost;
  }
}
