import { FinishId } from '@contexts/inventory/domain/value-objects/finish-id';

export class Finish {
  private readonly _id: FinishId;
  private _name: string;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: FinishId,
    name: string,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(name: string, createdBy: string) {
    const now = new Date();
    return new Finish(
      FinishId.generate(),
      name,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  public static reconstitute(
    id: string,
    name: string,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new Finish(
      FinishId.create(id),
      name,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public updateName(name: string, userId: string) {
    this._name = name;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): FinishId {
    return this._id;
  }

  get name(): string {
    return this._name;
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
