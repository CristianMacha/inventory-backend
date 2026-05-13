import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { FileRecordEntity } from './file-record.entity';

@Entity({ name: 'file_tags' })
@Index('IDX_file_tags_tag', ['tag'])
export class FileTagEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 36 })
  fileId: string;

  @Column({ type: 'varchar', length: 100 })
  tag: string;

  @ManyToOne(() => FileRecordEntity, (f) => f.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fileId' })
  file: FileRecordEntity;
}
