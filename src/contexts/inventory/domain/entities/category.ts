import { CategoryId } from '@contexts/inventory/domain/value-objects/category-id';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';

export class Category {
  private readonly _id: CategoryId;
  private _name: string;
  private _abbreviation: string;
  private _isActive: boolean;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: CategoryId,
    name: string,
    abbreviation: string,
    isActive: boolean,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._abbreviation = abbreviation;
    this._isActive = isActive;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidEntityNameException('Category');
    }
  }

  static create(name: string, abbreviation: string, createdBy: string) {
    Category.validateName(name);
    const now = new Date();
    return new Category(
      CategoryId.generate(),
      name,
      abbreviation,
      true,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  public static reconstitute(
    id: CategoryId,
    name: string,
    abbreviation: string,
    isActive: boolean,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new Category(
      id,
      name,
      abbreviation,
      isActive,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public updateName(name: string, userId: string) {
    Category.validateName(name);
    this._name = name;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateAbbreviation(abbreviation: string, userId: string) {
    this._abbreviation = abbreviation;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public setActive(isActive: boolean, userId: string) {
    this._isActive = isActive;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): CategoryId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get abbreviation(): string {
    return this._abbreviation;
  }

  get isActive(): boolean {
    return this._isActive;
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
