import { Permission } from '../../../../domain/entities/permission';
import { PermissionEntity } from '../entities/permission.entity';

export class PermissionMapper {
  static toPersistence(permission: Permission): PermissionEntity {
    const entity = new PermissionEntity();
    entity.id = permission.getId();
    entity.name = permission.getName();
    entity.description = permission.getDescription() || '';
    return entity;
  }

  static toDomain(entity: PermissionEntity): Permission {
    return new Permission(entity.id, entity.name, entity.description);
  }
}
