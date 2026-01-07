import { LevelId } from '@contexts/inventory/domain/value-objects/level-id';

export class Level {
  private readonly _id: LevelId;
  private _name: string;
  private _description: string;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: LevelId,
    name: string,
    description: string,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(name: string, description: string, createdBy: string) {
    const now = new Date();
    return new Level(
      LevelId.generate(),
      name,
      description,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  public static reconstitute(
    id: string,
    name: string,
    description: string,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new Level(
      LevelId.create(id),
      name,
      description,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public changeDetails(name: string, description: string, userId: string) {
    this._name = name;
    this._description = description;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): LevelId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get updatedBy(): string {
    return this._updatedBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
