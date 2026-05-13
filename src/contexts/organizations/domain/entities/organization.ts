import { OrganizationId } from '../value-objects/organization-id';

export class Organization {
  private readonly _id: OrganizationId;
  private _name: string;
  private _storageLimitBytes: number;
  private _storageUsedBytes: number;
  private readonly _createdBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: OrganizationId,
    name: string,
    storageLimitBytes: number,
    storageUsedBytes: number,
    createdBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._storageLimitBytes = storageLimitBytes;
    this._storageUsedBytes = storageUsedBytes;
    this._createdBy = createdBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(
    name: string,
    createdBy: string,
    storageLimitBytes = 10 * 1024 * 1024 * 1024,
  ): Organization {
    if (!name || name.trim().length === 0) {
      throw new Error('Organization name cannot be empty');
    }
    const now = new Date();
    return new Organization(
      OrganizationId.generate(),
      name.trim(),
      storageLimitBytes,
      0,
      createdBy,
      now,
      now,
    );
  }

  static reconstitute(
    id: OrganizationId,
    name: string,
    storageLimitBytes: number,
    storageUsedBytes: number,
    createdBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Organization {
    return new Organization(
      id,
      name,
      storageLimitBytes,
      storageUsedBytes,
      createdBy,
      createdAt,
      updatedAt,
    );
  }

  allocateStorage(bytes: number): void {
    if (this._storageUsedBytes + bytes > this._storageLimitBytes) {
      throw new Error(
        `Storage quota exceeded. Limit: ${this._storageLimitBytes}, Used: ${this._storageUsedBytes}, Requested: ${bytes}`,
      );
    }
    this._storageUsedBytes += bytes;
    this._updatedAt = new Date();
  }

  freeStorage(bytes: number): void {
    this._storageUsedBytes = Math.max(0, this._storageUsedBytes - bytes);
    this._updatedAt = new Date();
  }

  rename(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Organization name cannot be empty');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  get id(): OrganizationId {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get storageLimitBytes(): number {
    return this._storageLimitBytes;
  }
  get storageUsedBytes(): number {
    return this._storageUsedBytes;
  }
  get createdBy(): string {
    return this._createdBy;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
