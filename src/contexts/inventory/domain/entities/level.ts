import { LevelId } from '../value-objects/level-id';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';

export class Level {
  private readonly _id: LevelId;
  private _name: string;
  private _sortOrder: number;
  private _description: string;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: LevelId,
    name: string,
    sortOrder: number,
    description: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._sortOrder = sortOrder;
    this._description = description;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidEntityNameException('Level');
    }
  }

  static create(name: string, sortOrder: number, description: string): Level {
    Level.validateName(name);
    const now = new Date();
    return new Level(
      LevelId.generate(),
      name,
      sortOrder,
      description,
      true,
      now,
      now,
    );
  }

  static reconstitute(
    id: LevelId,
    name: string,
    sortOrder: number,
    description: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Level {
    return new Level(
      id,
      name,
      sortOrder,
      description,
      isActive,
      createdAt,
      updatedAt,
    );
  }

  updateName(name: string): void {
    Level.validateName(name);
    this._name = name;
    this._updatedAt = new Date();
  }

  updateSortOrder(sortOrder: number): void {
    this._sortOrder = sortOrder;
    this._updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  setActive(isActive: boolean): void {
    this._isActive = isActive;
    this._updatedAt = new Date();
  }

  get id(): LevelId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get sortOrder(): number {
    return this._sortOrder;
  }

  get description(): string {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
