import { FinishId } from '../value-objects/finish-id';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';

export class Finish {
  private readonly _id: FinishId;
  private _name: string;
  private _abbreviation: string;
  private _description: string;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: FinishId,
    name: string,
    abbreviation: string,
    description: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._abbreviation = abbreviation;
    this._description = description;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidEntityNameException('Finish');
    }
  }

  static create(
    name: string,
    abbreviation: string,
    description: string,
  ): Finish {
    Finish.validateName(name);
    const now = new Date();
    return new Finish(
      FinishId.generate(),
      name,
      abbreviation,
      description,
      true,
      now,
      now,
    );
  }

  static reconstitute(
    id: FinishId,
    name: string,
    abbreviation: string,
    description: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Finish {
    return new Finish(
      id,
      name,
      abbreviation,
      description,
      isActive,
      createdAt,
      updatedAt,
    );
  }

  updateName(name: string): void {
    Finish.validateName(name);
    this._name = name;
    this._updatedAt = new Date();
  }

  updateAbbreviation(abbreviation: string): void {
    this._abbreviation = abbreviation;
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

  get id(): FinishId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get abbreviation(): string {
    return this._abbreviation;
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
