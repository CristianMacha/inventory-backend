import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import type { BundleEntity } from './bundle.entity';
import { SlabStatus } from '../../../../domain/enums/slab-status.enum';

@Entity({ name: 'slabs' })
@Index('IDX_slabs_bundleId', ['bundleId'])
@Index('IDX_slabs_status', ['status'])
@Index('IDX_slabs_code', ['code'], { unique: true })
export class SlabEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  bundleId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  widthCm: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  heightCm: number;

  @Column({ type: 'enum', enum: SlabStatus, default: SlabStatus.AVAILABLE })
  status: SlabStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

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

  @ManyToOne('BundleEntity', 'slabs', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bundleId', referencedColumnName: 'id' })
  bundle: BundleEntity;
}
