import { JobItemId } from '../value-objects/job-item-id';
import { JobId } from '../value-objects/job-id';

export class JobItem {
  private readonly _id: JobItemId;
  private readonly _jobId: JobId;
  private _slabId: string;
  private _description: string;
  private _unitPrice: number;
  private _totalPrice: number;

  private constructor(
    id: JobItemId,
    jobId: JobId,
    slabId: string,
    description: string,
    unitPrice: number,
    totalPrice: number,
  ) {
    this._id = id;
    this._jobId = jobId;
    this._slabId = slabId;
    this._description = description;
    this._unitPrice = unitPrice;
    this._totalPrice = totalPrice;
  }

  static create(
    jobId: JobId,
    slabId: string,
    description: string,
    unitPrice: number,
  ): JobItem {
    return new JobItem(
      JobItemId.generate(),
      jobId,
      slabId,
      description,
      unitPrice,
      unitPrice,
    );
  }

  static reconstitute(
    id: JobItemId,
    jobId: JobId,
    slabId: string,
    description: string,
    unitPrice: number,
    totalPrice: number,
  ): JobItem {
    return new JobItem(id, jobId, slabId, description, unitPrice, totalPrice);
  }

  get id(): JobItemId {
    return this._id;
  }
  get jobId(): JobId {
    return this._jobId;
  }
  get slabId(): string {
    return this._slabId;
  }
  get description(): string {
    return this._description;
  }
  get unitPrice(): number {
    return this._unitPrice;
  }
  get totalPrice(): number {
    return this._totalPrice;
  }
}
