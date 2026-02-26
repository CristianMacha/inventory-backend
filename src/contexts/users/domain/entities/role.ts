import { Permission } from './permission';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';
import { InvalidRoleNameException } from '../exceptions/invalid-role-name.exception';

export class Role {
  private constructor(
    private readonly _id: RoleId,
    private _name: string,
    private _permissions: Permission[],
  ) {}

  static create(name: string, permissions: Permission[] = []): Role {
    if (!name || name.trim().length === 0) {
      throw new InvalidRoleNameException();
    }
    return new Role(RoleId.generate(), name, permissions);
  }

  static reconstitute(
    id: RoleId,
    name: string,
    permissions: Permission[],
  ): Role {
    return new Role(id, name, permissions);
  }

  public hasPermission(permissionName: string): boolean {
    return this.permissions.some((p) => p.name === permissionName);
  }

  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidRoleNameException();
    }
    this._name = name;
  }

  public updatePermissions(permissions: Permission[]): void {
    this._permissions = permissions;
  }

  get id(): RoleId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get permissions(): Permission[] {
    return this._permissions;
  }
}
