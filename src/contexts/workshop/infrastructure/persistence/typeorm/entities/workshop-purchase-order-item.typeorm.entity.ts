import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { WorkshopPurchaseOrderTypeormEntity } from './workshop-purchase-order.typeorm.entity';

@Entity({ name: 'workshop_purchase_order_items' })
export class WorkshopPurchaseOrderItemTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  purchaseOrderId: string;

  @Column({ type: 'uuid' })
  materialId: string;

  @Column({ type: 'varchar', length: 255 })
  materialName: string;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  purchaseQuantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  requestedQuantity: number;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  unitCost: number;

  @ManyToOne(() => WorkshopPurchaseOrderTypeormEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  purchaseOrder: WorkshopPurchaseOrderTypeormEntity;
}
