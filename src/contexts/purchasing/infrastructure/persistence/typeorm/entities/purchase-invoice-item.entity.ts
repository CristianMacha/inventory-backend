import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { InvoiceItemConcept } from '../../../../domain/enums/invoice-item-concept.enum';
import { PurchaseInvoiceEntity } from './purchase-invoice.entity';

@Entity({ name: 'purchase_invoice_items' })
@Index('IDX_purchase_invoice_items_invoiceId', ['purchaseInvoiceId'])
@Index('IDX_purchase_invoice_items_bundleId', ['bundleId'])
export class PurchaseInvoiceItemEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  purchaseInvoiceId: string;

  @Column('uuid')
  bundleId: string;

  @Column({
    type: 'enum',
    enum: InvoiceItemConcept,
    default: InvoiceItemConcept.MATERIAL,
  })
  concept: InvoiceItemConcept;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitCost: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalCost: number;

  @ManyToOne(() => PurchaseInvoiceEntity, (invoice) => invoice.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchaseInvoiceId', referencedColumnName: 'id' })
  purchaseInvoice: PurchaseInvoiceEntity;
}
