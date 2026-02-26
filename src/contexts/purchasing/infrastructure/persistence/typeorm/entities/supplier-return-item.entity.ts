import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { ReturnReason } from '../../../../domain/enums/return-reason.enum';
import type { SupplierReturnEntity } from './supplier-return.entity';

@Entity({ name: 'supplier_return_items' })
@Index('IDX_supplier_return_items_returnId', ['supplierReturnId'])
@Index('IDX_supplier_return_items_slabId', ['slabId'])
export class SupplierReturnItemEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  supplierReturnId: string;

  @Column('uuid')
  slabId: string;

  @Column('uuid')
  bundleId: string;

  @Column({
    type: 'enum',
    enum: ReturnReason,
    default: ReturnReason.DEFECTIVE,
  })
  reason: ReturnReason;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalCost: number;

  @ManyToOne('SupplierReturnEntity', 'items')
  supplierReturn: SupplierReturnEntity;
}
