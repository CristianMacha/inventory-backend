import { FolderId } from '../value-objects/folder-id';

export class Folder {
  private readonly _id: FolderId;
  private _name: string;
  private _parentId: FolderId | null;
  private readonly _organizationId: string;
  private readonly _createdByUserId: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: FolderId,
    name: string,
    parentId: FolderId | null,
    organizationId: string,
    createdByUserId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._parentId = parentId;
    this._organizationId = organizationId;
    this._createdByUserId = createdByUserId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(
    name: string,
    organizationId: string,
    createdByUserId: string,
    parentId: FolderId | null = null,
  ): Folder {
    if (!name || name.trim().length === 0) {
      throw new Error('Folder name cannot be empty');
    }
    const now = new Date();
    return new Folder(
      FolderId.generate(),
      name.trim(),
      parentId,
      organizationId,
      createdByUserId,
      now,
      now,
    );
  }

  static reconstitute(
    id: FolderId,
    name: string,
    parentId: FolderId | null,
    organizationId: string,
    createdByUserId: string,
    createdAt: Date,
    updatedAt: Date,
  ): Folder {
    return new Folder(
      id,
      name,
      parentId,
      organizationId,
      createdByUserId,
      createdAt,
      updatedAt,
    );
  }

  rename(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Folder name cannot be empty');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  moveToParent(parentId: FolderId | null): void {
    this._parentId = parentId;
    this._updatedAt = new Date();
  }

  get id(): FolderId {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get parentId(): FolderId | null {
    return this._parentId;
  }
  get organizationId(): string {
    return this._organizationId;
  }
  get createdByUserId(): string {
    return this._createdByUserId;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
