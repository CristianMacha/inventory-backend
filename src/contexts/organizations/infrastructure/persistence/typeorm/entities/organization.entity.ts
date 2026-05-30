import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'organizations' })
export class OrganizationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'bigint', default: 10737418240 })
  storageLimitBytes: number;

  @Column({ type: 'bigint', default: 0 })
  storageUsedBytes: number;

  @Column({ type: 'varchar', length: 36 })
  createdBy: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
