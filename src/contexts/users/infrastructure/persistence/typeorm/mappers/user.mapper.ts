import { User } from '../../../../domain/entities/user';
import { UserEntity } from '../entities/user.entity';
import { RoleMapper } from './role.mapper';

export class UserMapper {
  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.getId();
    entity.name = user.getName();
    entity.email = user.getEmail();
    entity.password = user.getPassword();
    if (user.getRoles()) {
      entity.roles = user
        .getRoles()
        .map((role) => RoleMapper.toPersistence(role));
    }
    return entity;
  }

  static toDomain(entity: UserEntity): User {
    const roles = entity.roles
      ? entity.roles.map((role) => RoleMapper.toDomain(role))
      : [];

    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      roles,
    );
  }
}
