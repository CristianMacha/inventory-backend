import { Permission } from './permission';
import { RoleId } from '@contexts/users/domain/value-objects/role-id';

export class Role {
  constructor(
    private readonly _id: RoleId,
    private _name: string,
    private _permissions: Permission[],
  ) {}

  public hasPermission(permissionName: string): boolean {
    return this.permissions.some((p) => p.name === permissionName);
  }

  public updateName(name: string): void {
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
