import { PermissionId } from '@contexts/users/domain/value-objects/permission-id';

export class Permission {
  constructor(
    private readonly _id: PermissionId,
    private readonly _name: string,
    private _description?: string,
  ) {}

  get id(): PermissionId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | undefined {
    return this._description;
  }
}
