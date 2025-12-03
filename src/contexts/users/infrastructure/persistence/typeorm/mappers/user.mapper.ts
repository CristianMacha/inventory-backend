import { User } from "../../../../domain/entities/user";
import { UserEntity } from "../entities/user.entity";

export class UserMapper {
  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.getId();
    entity.name = user.getName();
    entity.email = user.getEmail();
    entity.password = user.getPassword();
    return entity;
  }

  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password
    );
  }
}