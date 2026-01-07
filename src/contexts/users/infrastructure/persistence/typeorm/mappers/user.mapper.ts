import { User } from '../../../../domain/entities/user';
import { UserEntity } from '../entities/user.entity';
import { RoleMapper } from './role.mapper';
import { UserId } from '@contexts/users/domain/value-objects/user-id';

export class UserMapper {
  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id.getValue();
    entity.name = user.name;
    entity.email = user.email;
    entity.password = user.password;
    if (user.roles) {
      entity.roles = user.roles.map((role) => RoleMapper.toPersistence(role));
    }
    return entity;
  }

  static toDomain(entity: UserEntity): User {
    const userId = UserId.create(entity.id);
    const roles = entity.roles
      ? entity.roles.map((role) => RoleMapper.toDomain(role))
      : [];

    return new User(userId, entity.name, entity.email, entity.password, roles);
  }
}
