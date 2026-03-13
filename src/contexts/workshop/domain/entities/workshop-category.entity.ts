import { WorkshopCategoryId } from '../value-objects/workshop-category-id';
import { WorkshopItemNameEmptyException } from '../errors/workshop.errors';

export class WorkshopCategory {
  private readonly _id: WorkshopCategoryId;
  private _name: string;
  private _description: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: WorkshopCategoryId,
    name: string,
    description: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new WorkshopItemNameEmptyException('WorkshopCategory');
    }
  }

  static create(name: string, description?: string): WorkshopCategory {
    WorkshopCategory.validateName(name);
    const now = new Date();
    return new WorkshopCategory(
      WorkshopCategoryId.generate(),
      name,
      description ?? null,
      now,
      now,
    );
  }

  static reconstitute(
    id: WorkshopCategoryId,
    name: string,
    description: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): WorkshopCategory {
    return new WorkshopCategory(id, name, description, createdAt, updatedAt);
  }

  update(name?: string, description?: string | null): void {
    if (name !== undefined) {
      WorkshopCategory.validateName(name);
      this._name = name;
    }
    if (description !== undefined) this._description = description;
    this._updatedAt = new Date();
  }

  get id(): WorkshopCategoryId {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
