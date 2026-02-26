import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import type { ProductSupplierEntity } from './product-supplier.entity';
import type { BundleEntity } from './bundle.entity';

@Entity({ name: 'suppliers' })
@Index('IDX_suppliers_name', ['name'], { unique: true })
@Index('IDX_suppliers_isActive', ['isActive'])
export class SupplierEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  abbreviation: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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

  @OneToMany('ProductSupplierEntity', 'supplier')
  productSuppliers: ProductSupplierEntity[];

  @OneToMany('BundleEntity', 'supplier')
  bundles: BundleEntity[];
}
