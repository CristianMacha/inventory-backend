import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import type { ToolTypeormEntity } from './tool.typeorm.entity';
import type { MaterialTypeormEntity } from './material.typeorm.entity';

@Entity({ name: 'workshop_categories' })
@Index('IDX_workshop_categories_name', ['name'], { unique: true })
export class WorkshopCategoryTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany('ToolTypeormEntity', 'category')
  tools: ToolTypeormEntity[];

  @OneToMany('MaterialTypeormEntity', 'category')
  materials: MaterialTypeormEntity[];
}
