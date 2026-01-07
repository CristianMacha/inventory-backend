import { RoleOutputDto } from '@contexts/users/application/dtos/role.output.dto';
import { Role } from '@contexts/users/domain/entities/role';

export class RoleResponseMapper {
  public static toResponse(role: Role): RoleOutputDto {
    return {
      id: role.id.getValue(),
      name: role.name,
      permissions: role.permissions.map((e) => ({
        id: e.id.getValue(),
        name: e.name,
        description: e.description,
      })),
    };
  }
}
