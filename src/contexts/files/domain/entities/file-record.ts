import { FileId } from '../value-objects/file-id';

export class FileRecord {
  private readonly _id: FileId;
  private _name: string;
  private readonly _storageKey: string;
  private readonly _mimeType: string;
  private readonly _sizeBytes: number;
  private _folderId: string;
  private readonly _organizationId: string;
  private readonly _createdByUserId: string;
  private _tags: string[];
  private _deletedAt: Date | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: FileId,
    name: string,
    storageKey: string,
    mimeType: string,
    sizeBytes: number,
    folderId: string,
    organizationId: string,
    createdByUserId: string,
    tags: string[],
    deletedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._storageKey = storageKey;
    this._mimeType = mimeType;
    this._sizeBytes = sizeBytes;
    this._folderId = folderId;
    this._organizationId = organizationId;
    this._createdByUserId = createdByUserId;
    this._tags = tags;
    this._deletedAt = deletedAt;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(
    name: string,
    storageKey: string,
    mimeType: string,
    sizeBytes: number,
    folderId: string,
    organizationId: string,
    createdByUserId: string,
  ): FileRecord {
    const now = new Date();
    return new FileRecord(
      FileId.generate(),
      name,
      storageKey,
      mimeType,
      sizeBytes,
      folderId,
      organizationId,
      createdByUserId,
      [],
      null,
      now,
      now,
    );
  }

  static reconstitute(
    id: FileId,
    name: string,
    storageKey: string,
    mimeType: string,
    sizeBytes: number,
    folderId: string,
    organizationId: string,
    createdByUserId: string,
    tags: string[],
    deletedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ): FileRecord {
    return new FileRecord(
      id,
      name,
      storageKey,
      mimeType,
      sizeBytes,
      folderId,
      organizationId,
      createdByUserId,
      tags,
      deletedAt,
      createdAt,
      updatedAt,
    );
  }

  rename(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }
    this._name = name.trim();
    this._updatedAt = new Date();
  }

  addTags(tags: string[]): void {
    const normalized = tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
    const merged = Array.from(new Set([...this._tags, ...normalized]));
    this._tags = merged;
    this._updatedAt = new Date();
  }

  removeTags(tags: string[]): void {
    const normalized = new Set(tags.map((t) => t.trim().toLowerCase()));
    this._tags = this._tags.filter((t) => !normalized.has(t));
    this._updatedAt = new Date();
  }

  moveTo(folderId: string): void {
    this._folderId = folderId;
    this._updatedAt = new Date();
  }

  softDelete(): void {
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): FileId {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get storageKey(): string {
    return this._storageKey;
  }
  get mimeType(): string {
    return this._mimeType;
  }
  get sizeBytes(): number {
    return this._sizeBytes;
  }
  get folderId(): string {
    return this._folderId;
  }
  get organizationId(): string {
    return this._organizationId;
  }
  get createdByUserId(): string {
    return this._createdByUserId;
  }
  get tags(): string[] {
    return [...this._tags];
  }
  get deletedAt(): Date | null {
    return this._deletedAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
