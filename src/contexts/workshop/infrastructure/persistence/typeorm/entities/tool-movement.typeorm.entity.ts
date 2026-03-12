import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { ToolStatus } from '../../../../domain/enums/tool-status.enum';

@Entity({ name: 'workshop_tool_movements' })
@Index('IDX_wtm_toolId', ['toolId'])
@Index('IDX_wtm_createdAt', ['createdAt'])
export class ToolMovementTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  toolId: string;

  @Column({ type: 'enum', enum: ToolStatus })
  previousStatus: ToolStatus;

  @Column({ type: 'enum', enum: ToolStatus })
  newStatus: ToolStatus;

  @Column({ type: 'uuid', nullable: true })
  jobId: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 255 })
  createdBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
