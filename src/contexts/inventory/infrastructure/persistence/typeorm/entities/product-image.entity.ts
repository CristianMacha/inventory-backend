import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_images' })
@Index('IDX_product_images_productId', ['productId'])
export class ProductImageEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  productId: string;

  @Column({ type: 'varchar', length: 500 })
  publicId: string;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  product: ProductEntity;
}
