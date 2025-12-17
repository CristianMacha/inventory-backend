import { PermissionOutputDto } from './permission.output.dto';

export class RoleOutputDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly permissions: PermissionOutputDto[],
  ) {}
}
