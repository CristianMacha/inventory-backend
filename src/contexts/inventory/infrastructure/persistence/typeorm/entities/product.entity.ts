import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BrandEntity } from "./brand.entity";
import { CategoryEntity } from "./category.entity";

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column('uuid')
  brandId: string;

  @Column('uuid')
  categoryId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  createdBy: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  updatedBy: string;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => BrandEntity, brand => brand.products, { cascade: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'brandId', referencedColumnName: 'id' })
  brand: BrandEntity;

  @ManyToOne(() => CategoryEntity, category => category.products, { cascade: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: CategoryEntity;
}