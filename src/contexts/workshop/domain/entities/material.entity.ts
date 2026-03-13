import { MaterialId } from '../value-objects/material-id';
import {
  WorkshopItemNameEmptyException,
  InvalidPriceValueException,
} from '../errors/workshop.errors';

export class Material {
  private readonly _id: MaterialId;
  private _name: string;
  private _description: string | null;
  private _unit: string;
  private _minStock: number;
  private _unitPrice: number | null;
  private _categoryId: string | null;
  private _supplierId: string | null;
  private _imagePublicId: string | null;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: MaterialId,
    name: string,
    description: string | null,
    unit: string,
    minStock: number,
    unitPrice: number | null,
    categoryId: string | null,
    supplierId: string | null,
    imagePublicId: string | null,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._unit = unit;
    this._minStock = minStock;
    this._unitPrice = unitPrice;
    this._categoryId = categoryId;
    this._supplierId = supplierId;
    this._imagePublicId = imagePublicId;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new WorkshopItemNameEmptyException('Material');
    }
  }

  private static validateMinStock(minStock: number): void {
    if (minStock < 0) throw new Error('Min stock value cannot be negative');
  }

  private static validatePrice(price: number | null | undefined): void {
    if (price !== null && price !== undefined && price < 0) {
      throw new InvalidPriceValueException();
    }
  }

  static create(
    name: string,
    unit: string,
    createdBy: string,
    description?: string,
    minStock?: number,
    unitPrice?: number,
    categoryId?: string,
    supplierId?: string,
  ): Material {
    Material.validateName(name);
    const resolvedMinStock = minStock ?? 0;
    Material.validateMinStock(resolvedMinStock);
    Material.validatePrice(unitPrice);
    const now = new Date();
    return new Material(
      MaterialId.generate(),
      name,
      description ?? null,
      unit,
      resolvedMinStock,
      unitPrice ?? null,
      categoryId ?? null,
      supplierId ?? null,
      null,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  static reconstitute(
    id: MaterialId,
    name: string,
    description: string | null,
    unit: string,
    minStock: number,
    unitPrice: number | null,
    categoryId: string | null,
    supplierId: string | null,
    imagePublicId: string | null,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Material {
    return new Material(
      id,
      name,
      description,
      unit,
      minStock,
      unitPrice,
      categoryId,
      supplierId,
      imagePublicId,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  update(
    updatedBy: string,
    name?: string,
    description?: string | null,
    unit?: string,
    minStock?: number,
    unitPrice?: number | null,
    categoryId?: string | null,
    supplierId?: string | null,
  ): void {
    if (name !== undefined) {
      Material.validateName(name);
      this._name = name;
    }
    if (description !== undefined) this._description = description;
    if (unit !== undefined) this._unit = unit;
    if (minStock !== undefined) {
      Material.validateMinStock(minStock);
      this._minStock = minStock;
    }
    if (unitPrice !== undefined) {
      Material.validatePrice(unitPrice);
      this._unitPrice = unitPrice;
    }
    if (categoryId !== undefined) this._categoryId = categoryId;
    if (supplierId !== undefined) this._supplierId = supplierId;
    this._updatedBy = updatedBy;
    this._updatedAt = new Date();
  }

  updateImagePublicId(publicId: string | null, updatedBy: string): void {
    this._imagePublicId = publicId;
    this._updatedBy = updatedBy;
    this._updatedAt = new Date();
  }

  get id(): MaterialId {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get unit(): string {
    return this._unit;
  }
  get minStock(): number {
    return this._minStock;
  }
  get unitPrice(): number | null {
    return this._unitPrice;
  }
  get categoryId(): string | null {
    return this._categoryId;
  }
  get supplierId(): string | null {
    return this._supplierId;
  }
  get imagePublicId(): string | null {
    return this._imagePublicId;
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
