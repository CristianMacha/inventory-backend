import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { JobStatus } from '../../../../domain/enums/job-status.enum';
import type { JobItemEntity } from './job-item.entity';

@Entity({ name: 'jobs' })
@Index('IDX_jobs_status', ['status'])
@Index('IDX_jobs_projectName', ['projectName'])
@Index('IDX_jobs_clientName', ['clientName'])
export class JobEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  projectName: string;

  @Column({ type: 'varchar', length: 255 })
  clientName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  clientPhone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clientEmail: string;

  @Column({ type: 'text', nullable: true })
  clientAddress: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.QUOTED,
  })
  status: JobStatus;

  @Column({ type: 'date', nullable: true })
  scheduledDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completedDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  paidAmount: number;

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

  @OneToMany('JobItemEntity', 'job', {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  items: JobItemEntity[];
}
