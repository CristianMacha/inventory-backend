import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { PurchaseOrderStatus } from '../../../../domain/enums/purchase-order-status.enum';
import { WorkshopPurchaseOrderItemTypeormEntity } from './workshop-purchase-order-item.typeorm.entity';

@Entity({ name: 'workshop_purchase_orders' })
@Index('IDX_wpo_status', ['status'])
@Index('IDX_wpo_supplierId', ['supplierId'])
export class WorkshopPurchaseOrderTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  supplierId: string;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 255 })
  createdBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(
    () => WorkshopPurchaseOrderItemTypeormEntity,
    (item) => item.purchaseOrder,
    { cascade: true, eager: true },
  )
  items: WorkshopPurchaseOrderItemTypeormEntity[];
}
