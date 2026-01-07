import { BrandId } from '../value-objects/brand-id';
import { ProductId } from '../value-objects/product-id';
import { CategoryId } from '../value-objects/category-id';

export class Product {
  private readonly _id: ProductId;
  private _name: string;
  private _description: string;
  private _brandId: BrandId;
  private _categoryId: CategoryId;
  private _stock: number;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: ProductId,
    name: string,
    description: string,
    brandId: BrandId,
    categoryId: CategoryId,
    stock: number,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._brandId = brandId;
    this._categoryId = categoryId;
    this._stock = stock;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(
    name: string,
    description: string,
    brandId: BrandId,
    categoryId: CategoryId,
    stock: number,
    createdBy: string,
  ) {
    const now = new Date();
    return new Product(
      ProductId.generate(),
      name,
      description,
      brandId,
      categoryId,
      stock,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  public static reconstitute(
    id: ProductId,
    name: string,
    description: string,
    brandId: BrandId,
    categoryId: CategoryId,
    stock: number,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new Product(
      id,
      name,
      description,
      brandId,
      categoryId,
      stock,
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

  public updateDescription(description: string, userId: string) {
    this._description = description;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateBrandId(brandId: BrandId, userId: string) {
    this._brandId = brandId;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateCategoryId(categoryId: CategoryId, userId: string) {
    this._categoryId = categoryId;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateStock(stock: number, userId: string) {
    this._stock = stock;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get brandId(): BrandId {
    return this._brandId;
  }

  get categoryId(): CategoryId {
    return this._categoryId;
  }

  get stock(): number {
    return this._stock;
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
