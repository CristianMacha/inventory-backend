import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import type { WorkshopCategoryTypeormEntity } from './workshop-category.typeorm.entity';
import type { WorkshopSupplierTypeormEntity } from './workshop-supplier.typeorm.entity';

@Entity({ name: 'workshop_materials' })
@Index('IDX_workshop_materials_name', ['name'])
export class MaterialTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 50 })
  unit: string;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  minStock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice: number | null;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ type: 'uuid', nullable: true })
  supplierId: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  imagePublicId: string | null;

  @Column({ type: 'varchar', length: 255 })
  createdBy: string;

  @Column({ type: 'varchar', length: 255 })
  updatedBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne('WorkshopCategoryTypeormEntity', 'materials', { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: WorkshopCategoryTypeormEntity;

  @ManyToOne('WorkshopSupplierTypeormEntity', 'materials', { nullable: true })
  @JoinColumn({ name: 'supplierId' })
  supplier: WorkshopSupplierTypeormEntity;
}
