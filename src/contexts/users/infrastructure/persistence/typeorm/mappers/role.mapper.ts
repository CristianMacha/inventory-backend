import { Role } from '../../../../domain/entities/role';
import { RoleEntity } from '../entities/role.entity';
import { PermissionMapper } from './permission.mapper';

export class RoleMapper {
  static toPersistence(role: Role): RoleEntity {
    const entity = new RoleEntity();
    entity.id = role.getId();
    entity.name = role.getName();
    if (role.getPermissions()) {
      entity.permissions = role
        .getPermissions()
        .map((p) => PermissionMapper.toPersistence(p));
    }
    return entity;
  }

  static toDomain(entity: RoleEntity): Role {
    const permissions = entity.permissions
      ? entity.permissions.map((p) => PermissionMapper.toDomain(p))
      : [];

    return new Role(entity.id, entity.name, permissions);
  }
}
