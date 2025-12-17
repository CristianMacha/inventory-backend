import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'permissions' })
export class PermissionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
}
