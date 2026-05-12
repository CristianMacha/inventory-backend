import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderStatus } from '../../domain/enums/purchase-order-status.enum';

export class WorkshopPurchaseOrderItemDto {
  @ApiProperty() materialId: string;
  @ApiProperty() materialName: string;
  @ApiProperty() purchaseQuantity: number;
  @ApiProperty() requestedQuantity: number;
  @ApiProperty() unitCost: number;
  @ApiProperty() totalCost: number;
}

export class WorkshopPurchaseOrderDto {
  @ApiProperty() id: string;
  @ApiProperty() supplierId: string;
  @ApiProperty() supplierName: string;
  @ApiProperty({ enum: PurchaseOrderStatus }) status: PurchaseOrderStatus;
  @ApiProperty({ type: () => WorkshopPurchaseOrderItemDto, isArray: true })
  items: WorkshopPurchaseOrderItemDto[];
  @ApiProperty({ nullable: true }) notes: string | null;
  @ApiProperty() totalAmount: number;
  @ApiProperty() createdBy: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
