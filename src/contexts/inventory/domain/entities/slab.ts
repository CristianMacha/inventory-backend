import { SlabId } from '../value-objects/slab-id';
import { BundleId } from '../value-objects/bundle-id';
import { SlabStatus } from '../enums/slab-status.enum';
import { SlabDimensions } from '../value-objects/slab-dimensions';
import { InvalidEntityNameException } from '../errors/invalid-entity-name.exception';
import { InvalidSlabStatusTransitionException } from '../errors/invalid-slab-status-transition.exception';

const ALLOWED_TRANSITIONS: Record<SlabStatus, SlabStatus[]> = {
  [SlabStatus.AVAILABLE]: [SlabStatus.RESERVED, SlabStatus.RETURNING],
  [SlabStatus.RESERVED]: [SlabStatus.AVAILABLE, SlabStatus.SOLD],
  [SlabStatus.RETURNING]: [SlabStatus.AVAILABLE, SlabStatus.RETURNED],
  [SlabStatus.SOLD]: [],
  [SlabStatus.RETURNED]: [],
};

export class Slab {
  private readonly _id: SlabId;
  private readonly _bundleId: BundleId;
  private _code: string;
  private _dimensions: SlabDimensions;
  private _status: SlabStatus;
  private _description: string;
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private readonly _parentSlabId: string | null;

  private constructor(
    id: SlabId,
    bundleId: BundleId,
    code: string,
    dimensions: SlabDimensions,
    status: SlabStatus,
    description: string,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
    parentSlabId: string | null = null,
  ) {
    this._id = id;
    this._bundleId = bundleId;
    this._code = code;
    this._dimensions = dimensions;
    this._status = status;
    this._description = description;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._parentSlabId = parentSlabId;
  }

  private static validateCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new InvalidEntityNameException('Slab code');
    }
  }

  static create(
    bundleId: BundleId,
    code: string,
    dimensions: SlabDimensions,
    description: string,
    createdBy: string,
  ): Slab {
    Slab.validateCode(code);
    const now = new Date();
    return new Slab(
      SlabId.generate(),
      bundleId,
      code,
      dimensions,
      SlabStatus.AVAILABLE,
      description,
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  static createRemnant(
    bundleId: BundleId,
    parentSlabId: string,
    code: string,
    dimensions: SlabDimensions,
    description: string,
    createdBy: string,
  ): Slab {
    Slab.validateCode(code);
    const now = new Date();
    return new Slab(
      SlabId.generate(),
      bundleId,
      code,
      dimensions,
      SlabStatus.AVAILABLE,
      description,
      createdBy,
      createdBy,
      now,
      now,
      parentSlabId,
    );
  }

  static reconstitute(
    id: SlabId,
    bundleId: BundleId,
    code: string,
    dimensions: SlabDimensions,
    status: SlabStatus,
    description: string,
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
    parentSlabId: string | null = null,
  ): Slab {
    return new Slab(
      id,
      bundleId,
      code,
      dimensions,
      status,
      description,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
      parentSlabId,
    );
  }

  public updateStatus(status: SlabStatus, userId: string): void {
    if (!ALLOWED_TRANSITIONS[this._status].includes(status)) {
      throw new InvalidSlabStatusTransitionException(this._status, status);
    }
    this._status = status;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateDimensions(dimensions: SlabDimensions, userId: string): void {
    this._dimensions = dimensions;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateDescription(description: string, userId: string): void {
    this._description = description;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateCode(code: string, userId: string): void {
    Slab.validateCode(code);
    this._code = code;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  get id(): SlabId {
    return this._id;
  }

  get bundleId(): BundleId {
    return this._bundleId;
  }

  get code(): string {
    return this._code;
  }

  get dimensions(): SlabDimensions {
    return this._dimensions;
  }

  get status(): SlabStatus {
    return this._status;
  }

  get description(): string {
    return this._description;
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

  get parentSlabId(): string | null {
    return this._parentSlabId;
  }
}
