import { User } from '@contexts/users/domain/entities/user';
import { UserOutputDto } from '@contexts/users/application/dtos/user.output.dto';

export class UserResponseMapper {
  public static toResponse(user: User): UserOutputDto {
    return {
      id: user.id.getValue(),
      email: user.email,
      name: user.name,
      roles: user.roles.map((e) => e.name),
      permissions: user.roles.flatMap((r) => r.permissions.map((p) => p.name)),
    };
  }
}
