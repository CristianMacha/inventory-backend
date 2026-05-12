import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { RequestStatus } from '../../../../domain/enums/request-status.enum';
import { RequestType } from '../../../../domain/enums/request-type.enum';
import { RequestPriority } from '../../../../domain/enums/request-priority.enum';

@Entity({ name: 'workshop_requests' })
@Index('IDX_wr_status', ['status'])
@Index('IDX_wr_requestedBy', ['requestedBy'])
@Index('IDX_wr_requestType', ['requestType'])
export class WorkshopRequestTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RequestType })
  requestType: RequestType;

  @Column({ type: 'uuid' })
  itemId: string;

  @Column({ type: 'decimal', precision: 12, scale: 3, nullable: true })
  quantity: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 3, nullable: true })
  approvedQuantity: number | null;

  @Column({ type: 'uuid', nullable: true })
  jobId: string | null;

  @Column({
    type: 'enum',
    enum: RequestPriority,
    default: RequestPriority.NORMAL,
  })
  priority: RequestPriority;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Column({ type: 'varchar', length: 255 })
  requestedBy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resolvedBy: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
