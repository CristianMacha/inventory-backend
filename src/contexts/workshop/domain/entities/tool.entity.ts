import { ToolId } from '../value-objects/tool-id';
import { ToolStatus } from '../enums/tool-status.enum';
import { WorkshopItemNameEmptyException, InvalidPriceValueException } from '../errors/workshop.errors';

export class Tool {
  private readonly _id: ToolId;
  private _name: string;
  private _description: string | null;
  private _status: ToolStatus;
  private _categoryId: string | null;
  private _supplierId: string | null;
  private _imagePublicId: string | null;
  private _purchasePrice: number | null;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: ToolId,
    name: string,
    description: string | null,
    status: ToolStatus,
    categoryId: string | null,
    supplierId: string | null,
    imagePublicId: string | null,
    purchasePrice: number | null,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._status = status;
    this._categoryId = categoryId;
    this._supplierId = supplierId;
    this._imagePublicId = imagePublicId;
    this._purchasePrice = purchasePrice;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new WorkshopItemNameEmptyException('Tool');
    }
  }

  private static validatePrice(price: number | null | undefined): void {
    if (price !== null && price !== undefined && price < 0) {
      throw new InvalidPriceValueException();
    }
  }

  static create(
    name: string,
    createdBy: string,
    description?: string,
    categoryId?: string,
    supplierId?: string,
    purchasePrice?: number,
  ): Tool {
    Tool.validateName(name);
    Tool.validatePrice(purchasePrice);
    const now = new Date();
    return new Tool(
      ToolId.generate(),
      name,
      description ?? null,
      ToolStatus.AVAILABLE,
      categoryId ?? null,
      supplierId ?? null,
      null,
      purchasePrice ?? null,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  static reconstitute(
    id: ToolId,
    name: string,
    description: string | null,
    status: ToolStatus,
    categoryId: string | null,
    supplierId: string | null,
    imagePublicId: string | null,
    purchasePrice: number | null,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Tool {
    return new Tool(
      id, name, description, status, categoryId, supplierId,
      imagePublicId, purchasePrice, createdBy, updatedBy, createdAt, updatedAt,
    );
  }

  update(
    updatedBy: string,
    name?: string,
    description?: string | null,
    status?: ToolStatus,
    categoryId?: string | null,
    supplierId?: string | null,
    purchasePrice?: number | null,
  ): void {
    if (name !== undefined) {
      Tool.validateName(name);
      this._name = name;
    }
    if (description !== undefined) this._description = description;
    if (status !== undefined) this._status = status;
    if (categoryId !== undefined) this._categoryId = categoryId;
    if (supplierId !== undefined) this._supplierId = supplierId;
    if (purchasePrice !== undefined) {
      Tool.validatePrice(purchasePrice);
      this._purchasePrice = purchasePrice;
    }
    this._updatedBy = updatedBy;
    this._updatedAt = new Date();
  }

  updateImagePublicId(publicId: string | null, updatedBy: string): void {
    this._imagePublicId = publicId;
    this._updatedBy = updatedBy;
    this._updatedAt = new Date();
  }

  get id(): ToolId { return this._id; }
  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get status(): ToolStatus { return this._status; }
  get categoryId(): string | null { return this._categoryId; }
  get supplierId(): string | null { return this._supplierId; }
  get imagePublicId(): string | null { return this._imagePublicId; }
  get purchasePrice(): number | null { return this._purchasePrice; }
  get createdBy(): string { return this._createdBy; }
  get updatedBy(): string { return this._updatedBy; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}
