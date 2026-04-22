import { WorkshopRequestId } from '../value-objects/workshop-request-id';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';
import { RequestPriority } from '../enums/request-priority.enum';
import {
  RequestAlreadyResolvedException,
  InvalidRequestQuantityException,
} from '../errors/workshop.errors';

export class WorkshopRequest {
  private readonly _id: WorkshopRequestId;
  private readonly _requestType: RequestType;
  private readonly _itemId: string;
  private readonly _quantity: number | null;
  private readonly _jobId: string | null;
  private readonly _priority: RequestPriority;
  private readonly _notes: string | null;
  private _status: RequestStatus;
  private readonly _requestedBy: string;
  private _resolvedBy: string | null;
  private _resolvedAt: Date | null;
  private _rejectionReason: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: WorkshopRequestId,
    requestType: RequestType,
    itemId: string,
    quantity: number | null,
    jobId: string | null,
    priority: RequestPriority,
    notes: string | null,
    status: RequestStatus,
    requestedBy: string,
    resolvedBy: string | null,
    resolvedAt: Date | null,
    rejectionReason: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._requestType = requestType;
    this._itemId = itemId;
    this._quantity = quantity;
    this._jobId = jobId;
    this._priority = priority;
    this._notes = notes;
    this._status = status;
    this._requestedBy = requestedBy;
    this._resolvedBy = resolvedBy;
    this._resolvedAt = resolvedAt;
    this._rejectionReason = rejectionReason;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(
    requestType: RequestType,
    itemId: string,
    requestedBy: string,
    priority: RequestPriority,
    quantity?: number,
    jobId?: string,
    notes?: string,
  ): WorkshopRequest {
    if (requestType === RequestType.MATERIAL) {
      if (quantity === undefined || quantity === null || quantity <= 0) {
        throw new InvalidRequestQuantityException();
      }
    }

    const now = new Date();
    return new WorkshopRequest(
      WorkshopRequestId.generate(),
      requestType,
      itemId,
      requestType === RequestType.MATERIAL ? (quantity ?? null) : null,
      jobId ?? null,
      priority,
      notes ?? null,
      RequestStatus.PENDING,
      requestedBy,
      null,
      null,
      null,
      now,
      now,
    );
  }

  static reconstitute(
    id: WorkshopRequestId,
    requestType: RequestType,
    itemId: string,
    quantity: number | null,
    jobId: string | null,
    priority: RequestPriority,
    notes: string | null,
    status: RequestStatus,
    requestedBy: string,
    resolvedBy: string | null,
    resolvedAt: Date | null,
    rejectionReason: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): WorkshopRequest {
    return new WorkshopRequest(
      id,
      requestType,
      itemId,
      quantity,
      jobId,
      priority,
      notes,
      status,
      requestedBy,
      resolvedBy,
      resolvedAt,
      rejectionReason,
      createdAt,
      updatedAt,
    );
  }

  approve(resolvedBy: string): void {
    if (this._status !== RequestStatus.PENDING) {
      throw new RequestAlreadyResolvedException(this._id.getValue());
    }
    this._status = RequestStatus.APPROVED;
    this._resolvedBy = resolvedBy;
    this._resolvedAt = new Date();
    this._updatedAt = new Date();
  }

  reject(resolvedBy: string, rejectionReason?: string): void {
    if (this._status !== RequestStatus.PENDING) {
      throw new RequestAlreadyResolvedException(this._id.getValue());
    }
    this._status = RequestStatus.REJECTED;
    this._resolvedBy = resolvedBy;
    this._resolvedAt = new Date();
    this._rejectionReason = rejectionReason ?? null;
    this._updatedAt = new Date();
  }

  get id(): WorkshopRequestId {
    return this._id;
  }
  get requestType(): RequestType {
    return this._requestType;
  }
  get itemId(): string {
    return this._itemId;
  }
  get quantity(): number | null {
    return this._quantity;
  }
  get jobId(): string | null {
    return this._jobId;
  }
  get priority(): RequestPriority {
    return this._priority;
  }
  get notes(): string | null {
    return this._notes;
  }
  get status(): RequestStatus {
    return this._status;
  }
  get requestedBy(): string {
    return this._requestedBy;
  }
  get resolvedBy(): string | null {
    return this._resolvedBy;
  }
  get resolvedAt(): Date | null {
    return this._resolvedAt;
  }
  get rejectionReason(): string | null {
    return this._rejectionReason;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
