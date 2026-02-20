import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';

export class Brand {
  private readonly _id: BrandId;
  private _name: string;
  private _description: string;
  private _isActive: boolean;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: BrandId,
    name: string,
    description: string,
    isActive: boolean,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._isActive = isActive;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidEntityNameException('Brand');
    }
  }

  static create(name: string, description: string, createdBy: string): Brand {
    Brand.validateName(name);
    const now = new Date();
    return new Brand(
      BrandId.generate(),
      name,
      description,
      true,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  static reconstitute(
    id: BrandId,
    name: string,
    description: string,
    isActive: boolean,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Brand {
    return new Brand(
      id,
      name,
      description,
      isActive,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public updateName(name: string, userId: string): void {
    Brand.validateName(name);
    this._name = name;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateDescription(description: string, userId: string): void {
    this._description = description;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public setActive(isActive: boolean, userId: string): void {
    this._isActive = isActive;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): BrandId {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string {
    return this._description;
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
