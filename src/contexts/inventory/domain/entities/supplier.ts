import { SupplierId } from '../value-objects/supplier-id';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';

export class Supplier {
  private readonly _id: SupplierId;
  private _name: string;
  private _abbreviation: string;
  private _isActive: boolean;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: SupplierId,
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
      throw new InvalidEntityNameException('Supplier');
    }
  }

  static create(
    name: string,
    abbreviation: string,
    createdBy: string,
  ): Supplier {
    Supplier.validateName(name);
    const now = new Date();
    return new Supplier(
      SupplierId.generate(),
      name,
      abbreviation,
      true,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  static reconstitute(
    id: SupplierId,
    name: string,
    abbreviation: string,
    isActive: boolean,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Supplier {
    return new Supplier(
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

  updateName(name: string, userId: string): void {
    Supplier.validateName(name);
    this._name = name;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  updateAbbreviation(abbreviation: string, userId: string): void {
    this._abbreviation = abbreviation;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  setActive(isActive: boolean, userId: string): void {
    this._isActive = isActive;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): SupplierId {
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
