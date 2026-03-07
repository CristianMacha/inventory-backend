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
import { BrandEntity } from './brand.entity';
import { CategoryEntity } from './category.entity';
import { LevelEntity } from './level.entity';
import { FinishEntity } from './finish.entity';
import type { ProductSupplierEntity } from './product-supplier.entity';

@Entity({ name: 'products' })
@Index('IDX_products_brandId', ['brandId'])
@Index('IDX_products_categoryId', ['categoryId'])
@Index('IDX_products_levelId', ['levelId'])
@Index('IDX_products_finishId', ['finishId'])
@Index('IDX_products_name', ['name'])
export class ProductEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isOnline: boolean;

  @Column('uuid')
  categoryId: string;

  @Column('uuid')
  levelId: string;

  @Column('uuid')
  finishId: string;

  @Column({ type: 'uuid', nullable: true })
  brandId: string | null;

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

  @ManyToOne(() => BrandEntity, (brand) => brand.products, {
    cascade: false,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'brandId', referencedColumnName: 'id' })
  brand: BrandEntity | null;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: CategoryEntity;

  @ManyToOne(() => LevelEntity, (level) => level.products, {
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'levelId', referencedColumnName: 'id' })
  level: LevelEntity;

  @ManyToOne(() => FinishEntity, (finish) => finish.products, {
    cascade: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'finishId', referencedColumnName: 'id' })
  finish: FinishEntity;

  @OneToMany('ProductSupplierEntity', 'product')
  productSuppliers: ProductSupplierEntity[];
}
