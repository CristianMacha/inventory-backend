import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => PermissionEntity, { cascade: true })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];
}
