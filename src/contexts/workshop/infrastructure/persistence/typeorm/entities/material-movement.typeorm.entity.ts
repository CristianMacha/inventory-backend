import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { MaterialMovementReason } from '../../../../domain/enums/material-movement-reason.enum';

@Entity({ name: 'workshop_material_movements' })
@Index('IDX_wmm_materialId', ['materialId'])
@Index('IDX_wmm_createdAt', ['createdAt'])
export class MaterialMovementTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  materialId: string;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  delta: number;

  @Column({
    type: 'enum',
    enum: MaterialMovementReason,
  })
  reason: MaterialMovementReason;

  @Column({ type: 'uuid', nullable: true })
  jobId: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 255 })
  createdBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
