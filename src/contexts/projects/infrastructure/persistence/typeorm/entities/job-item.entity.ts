import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { JobEntity } from './job.entity';

@Entity({ name: 'job_items' })
@Index('IDX_job_items_jobId', ['jobId'])
@Index('IDX_job_items_slabId', ['slabId'])
export class JobItemEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  jobId: string;

  @Column('uuid')
  slabId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => JobEntity, (job) => job.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId', referencedColumnName: 'id' })
  job: JobEntity;
}
