import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { SupplierEntity } from './supplier.entity';

@Entity({ name: 'product_suppliers' })
@Unique('UQ_product_supplier', ['productId', 'supplierId'])
@Index('IDX_product_suppliers_productId', ['productId'])
@Index('IDX_product_suppliers_supplierId', ['supplierId'])
export class ProductSupplierEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  productId: string;

  @Column('uuid')
  supplierId: string;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @ManyToOne(() => ProductEntity, (product) => product.productSuppliers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product: ProductEntity;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.productSuppliers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplierId', referencedColumnName: 'id' })
  supplier: SupplierEntity;
}
