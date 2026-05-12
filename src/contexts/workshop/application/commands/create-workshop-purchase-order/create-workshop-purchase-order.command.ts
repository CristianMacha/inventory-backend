export interface CreatePurchaseOrderItemInput {
  materialId: string;
  materialName: string;
  purchaseQuantity: number;
  requestedQuantity: number;
  unitCost: number;
}

export class CreateWorkshopPurchaseOrderCommand {
  constructor(
    public readonly supplierId: string,
    public readonly items: CreatePurchaseOrderItemInput[],
    public readonly createdBy: string,
    public readonly notes?: string,
  ) {}
}
