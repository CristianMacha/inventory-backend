import { Permission } from '@contexts/users/domain/entities/permission';
import { PermissionOutputDto } from '@contexts/users/application/dtos/permission.output.dto';

export class PermissionResponseMapper {
  public static toResponse(permission: Permission): PermissionOutputDto {
    return {
      id: permission.id.getValue(),
      name: permission.name,
      description: permission.description,
    };
  }
}
