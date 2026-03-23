import { AggregateRoot } from '@nestjs/cqrs';
import { BrandId } from '../value-objects/brand-id';
import { ProductId } from '../value-objects/product-id';
import { CategoryId } from '../value-objects/category-id';
import { LevelId } from '../value-objects/level-id';
import { FinishId } from '../value-objects/finish-id';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';
import { ProductCreatedEvent } from '../events/product-created.event';

export class Product extends AggregateRoot {
  private readonly _id: ProductId;
  private _name: string;
  private _slug: string;
  private _description: string;
  private _isActive: boolean;
  private _isOnline: boolean;
  private _categoryId: CategoryId;
  private _levelId: LevelId;
  private _finishId: FinishId;
  private _brandId: BrandId | null;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: ProductId,
    name: string,
    slug: string,
    description: string,
    isActive: boolean,
    isOnline: boolean,
    categoryId: CategoryId,
    levelId: LevelId,
    finishId: FinishId,
    brandId: BrandId | null,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this._id = id;
    this._name = name;
    this._slug = slug;
    this._description = description;
    this._isActive = isActive;
    this._isOnline = isOnline;
    this._categoryId = categoryId;
    this._levelId = levelId;
    this._finishId = finishId;
    this._brandId = brandId;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidEntityNameException('Product');
    }
  }

  static create(
    name: string,
    description: string,
    categoryId: CategoryId,
    levelId: LevelId,
    finishId: FinishId,
    createdBy: string,
    brandId: BrandId | null = null,
  ): Product {
    Product.validateName(name);
    const now = new Date();
    const product = new Product(
      ProductId.generate(),
      name,
      Product.generateSlug(name),
      description,
      true,
      false,
      categoryId,
      levelId,
      finishId,
      brandId,
      createdBy,
      createdBy,
      now,
      now,
    );
    product.apply(
      new ProductCreatedEvent(
        product._id.getValue(),
        name,
        brandId?.getValue() ?? null,
        categoryId.getValue(),
        createdBy,
      ),
    );
    return product;
  }

  public static reconstitute(
    id: ProductId,
    name: string,
    slug: string,
    description: string,
    isActive: boolean,
    isOnline: boolean,
    categoryId: CategoryId,
    levelId: LevelId,
    finishId: FinishId,
    brandId: BrandId | null,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Product {
    return new Product(
      id,
      name,
      slug,
      description,
      isActive,
      isOnline,
      categoryId,
      levelId,
      finishId,
      brandId,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public updateName(name: string, userId: string): void {
    Product.validateName(name);
    this._name = name;
    this._slug = Product.generateSlug(name);
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateDescription(description: string, userId: string): void {
    this._description = description;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateBrandId(brandId: BrandId | null, userId: string): void {
    this._brandId = brandId;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateCategoryId(categoryId: CategoryId, userId: string): void {
    this._categoryId = categoryId;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateLevelId(levelId: LevelId, userId: string): void {
    this._levelId = levelId;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateFinishId(finishId: FinishId, userId: string): void {
    this._finishId = finishId;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public setActive(isActive: boolean, userId: string): void {
    this._isActive = isActive;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public setOnline(isOnline: boolean, userId: string): void {
    this._isOnline = isOnline;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): ProductId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  get categoryId(): CategoryId {
    return this._categoryId;
  }

  get levelId(): LevelId {
    return this._levelId;
  }

  get finishId(): FinishId {
    return this._finishId;
  }

  get brandId(): BrandId | null {
    return this._brandId;
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
