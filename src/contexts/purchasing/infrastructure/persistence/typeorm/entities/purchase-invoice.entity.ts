import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { PurchaseInvoiceStatus } from '../../../../domain/enums/purchase-invoice-status.enum';
import type { PurchaseInvoiceItemEntity } from './purchase-invoice-item.entity';

@Entity({ name: 'purchase_invoices' })
@Index('IDX_purchase_invoices_invoiceNumber', ['invoiceNumber'], {
  unique: true,
})
@Index('IDX_purchase_invoices_supplierId', ['supplierId'])
@Index('IDX_purchase_invoices_status', ['status'])
export class PurchaseInvoiceEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  invoiceNumber: string;

  @Column('uuid')
  supplierId: string;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidAmount: number;

  @Column({
    type: 'enum',
    enum: PurchaseInvoiceStatus,
    default: PurchaseInvoiceStatus.DRAFT,
  })
  status: PurchaseInvoiceStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentPath: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  createdBy: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  updatedBy: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany('PurchaseInvoiceItemEntity', 'purchaseInvoice', { cascade: true })
  items: PurchaseInvoiceItemEntity[];
}
