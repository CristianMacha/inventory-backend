import { PermissionOutputDto } from './permission.output.dto';

export class RoleOutputDto {
  id: string;
  name: string;
  permissions: PermissionOutputDto[];
}
