import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { SupplierReturnStatus } from '../../../../domain/enums/supplier-return-status.enum';
import type { SupplierReturnItemEntity } from './supplier-return-item.entity';

@Entity({ name: 'supplier_returns' })
@Index('IDX_supplier_returns_supplierId', ['supplierId'])
@Index('IDX_supplier_returns_status', ['status'])
@Index('IDX_supplier_returns_purchaseInvoiceId', ['purchaseInvoiceId'])
export class SupplierReturnEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  purchaseInvoiceId: string;

  @Column('uuid')
  supplierId: string;

  @Column({ type: 'date' })
  returnDate: Date;

  @Column({
    type: 'enum',
    enum: SupplierReturnStatus,
    default: SupplierReturnStatus.DRAFT,
  })
  status: SupplierReturnStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentPath: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  creditAmount: number;

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

  @OneToMany('SupplierReturnItemEntity', 'supplierReturn', { cascade: true })
  items: SupplierReturnItemEntity[];
}
