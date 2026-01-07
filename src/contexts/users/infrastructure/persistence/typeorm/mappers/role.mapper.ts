import { Role } from '../../../../domain/entities/role';
import { RoleEntity } from '../entities/role.entity';
import { PermissionMapper } from './permission.mapper';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';

export class RoleMapper {
  static toPersistence(role: Role): RoleEntity {
    const entity = new RoleEntity();
    entity.id = role.id.getValue();
    entity.name = role.name;
    if (role.permissions) {
      entity.permissions = role.permissions.map((p) =>
        PermissionMapper.toPersistence(p),
      );
    }
    return entity;
  }

  static toDomain(entity: RoleEntity): Role {
    const permissions = entity.permissions
      ? entity.permissions.map((p) => PermissionMapper.toDomain(p))
      : [];

    return new Role(RoleId.create(entity.id), entity.name, permissions);
  }
}
