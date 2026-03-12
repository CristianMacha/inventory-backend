import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import type { ToolTypeormEntity } from './tool.typeorm.entity';
import type { MaterialTypeormEntity } from './material.typeorm.entity';

@Entity({ name: 'workshop_suppliers' })
@Index('IDX_workshop_suppliers_name', ['name'], { unique: true })
export class WorkshopSupplierTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany('ToolTypeormEntity', 'supplier')
  tools: ToolTypeormEntity[];

  @OneToMany('MaterialTypeormEntity', 'supplier')
  materials: MaterialTypeormEntity[];
}
