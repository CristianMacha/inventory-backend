import { Permission } from '../../../../domain/entities/permission';
import { PermissionEntity } from '../entities/permission.entity';
import { PermissionId } from '@contexts/users/domain/value-objects/permission-id';

export class PermissionMapper {
  static toPersistence(permission: Permission): PermissionEntity {
    const entity = new PermissionEntity();
    entity.id = permission.id.getValue();
    entity.name = permission.name;
    entity.description = permission.description || '';
    return entity;
  }

  static toDomain(entity: PermissionEntity): Permission {
    return new Permission(
      PermissionId.create(entity.id),
      entity.name,
      entity.description,
    );
  }
}
