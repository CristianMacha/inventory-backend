import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ToolStatus } from '../../../../domain/enums/tool-status.enum';
import type { WorkshopCategoryTypeormEntity } from './workshop-category.typeorm.entity';
import type { WorkshopSupplierTypeormEntity } from './workshop-supplier.typeorm.entity';

@Entity({ name: 'workshop_tools' })
@Index('IDX_workshop_tools_name', ['name'])
@Index('IDX_workshop_tools_status', ['status'])
export class ToolTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ToolStatus, default: ToolStatus.AVAILABLE })
  status: ToolStatus;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ type: 'uuid', nullable: true })
  supplierId: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  imagePublicId: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice: number | null;

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

  @ManyToOne('WorkshopCategoryTypeormEntity', 'tools', { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: WorkshopCategoryTypeormEntity;

  @ManyToOne('WorkshopSupplierTypeormEntity', 'tools', { nullable: true })
  @JoinColumn({ name: 'supplierId' })
  supplier: WorkshopSupplierTypeormEntity;
}
