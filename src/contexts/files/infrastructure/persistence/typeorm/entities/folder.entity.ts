import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'folders' })
export class FolderEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  parentId: string | null;

  @Column({ type: 'varchar', length: 36 })
  organizationId: string;

  @Column({ type: 'varchar', length: 36 })
  createdByUserId: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => FolderEntity, (f) => f.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: FolderEntity | null;

  @OneToMany(() => FolderEntity, (f) => f.parent)
  children: FolderEntity[];
}
