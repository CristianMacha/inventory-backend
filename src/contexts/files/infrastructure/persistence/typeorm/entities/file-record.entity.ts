import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { FileTagEntity } from './file-tag.entity';

@Entity({ name: 'file_records' })
@Index('IDX_file_records_org_folder', ['organizationId', 'folderId'])
export class FileRecordEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 512 })
  storageKey: string;

  @Column({ type: 'varchar', length: 128 })
  mimeType: string;

  @Column({ type: 'bigint' })
  sizeBytes: number;

  @Column({ type: 'varchar', length: 36 })
  folderId: string;

  @Column({ type: 'varchar', length: 36 })
  organizationId: string;

  @Column({ type: 'varchar', length: 36 })
  createdByUserId: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => FileTagEntity, (tag) => tag.file, { eager: true })
  tags: FileTagEntity[];
}
