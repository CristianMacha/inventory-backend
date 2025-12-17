import { Permission } from './permission';

export class Role {
  constructor(
    private readonly id: string,
    private name: string,
    private permissions: Permission[],
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPermissions(): Permission[] {
    return this.permissions;
  }

  hasPermission(permissionName: string): boolean {
    return this.permissions.some((p) => p.getName() === permissionName);
  }

  updateName(name: string): void {
    this.name = name;
  }

  updatePermissions(permissions: Permission[]): void {
    this.permissions = permissions;
  }
}
