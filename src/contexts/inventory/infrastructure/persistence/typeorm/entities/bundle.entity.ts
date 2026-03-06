import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { SupplierEntity } from './supplier.entity';
import type { SlabEntity } from './slab.entity';

@Entity({ name: 'bundles' })
@Index('IDX_bundles_productId', ['productId'])
@Index('IDX_bundles_supplierId', ['supplierId'])
export class BundleEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  productId: string;

  @Column('uuid')
  supplierId: string;

  @Column({ type: 'uuid', nullable: true })
  purchaseInvoiceId: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagePublicId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lotNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  thicknessCm: number;

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

  @ManyToOne(() => ProductEntity, { cascade: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @ManyToOne(() => SupplierEntity, { cascade: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplierId', referencedColumnName: 'id' })
  supplier: SupplierEntity;

  @OneToMany('SlabEntity', 'bundle')
  slabs: SlabEntity[];
}
