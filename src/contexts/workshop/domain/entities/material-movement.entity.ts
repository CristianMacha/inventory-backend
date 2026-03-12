import { MaterialMovementId } from '../value-objects/material-movement-id';
import { MaterialMovementReason } from '../enums/material-movement-reason.enum';

export class MaterialMovement {
  private readonly _id: MaterialMovementId;
  private readonly _materialId: string;
  private readonly _delta: number;
  private readonly _reason: MaterialMovementReason;
  private readonly _jobId: string | null;
  private readonly _notes: string | null;
  private readonly _createdBy: string;
  private readonly _createdAt: Date;

  private constructor(
    id: MaterialMovementId,
    materialId: string,
    delta: number,
    reason: MaterialMovementReason,
    jobId: string | null,
    notes: string | null,
    createdBy: string,
    createdAt: Date,
  ) {
    this._id = id;
    this._materialId = materialId;
    this._delta = delta;
    this._reason = reason;
    this._jobId = jobId;
    this._notes = notes;
    this._createdBy = createdBy;
    this._createdAt = createdAt;
  }

  static create(
    materialId: string,
    delta: number,
    reason: MaterialMovementReason,
    createdBy: string,
    jobId?: string,
    notes?: string,
  ): MaterialMovement {
    if (delta === 0) throw new Error('Movement delta cannot be zero');
    return new MaterialMovement(
      MaterialMovementId.generate(),
      materialId,
      delta,
      reason,
      jobId ?? null,
      notes ?? null,
      createdBy,
      new Date(),
    );
  }

  static reconstitute(
    id: MaterialMovementId,
    materialId: string,
    delta: number,
    reason: MaterialMovementReason,
    jobId: string | null,
    notes: string | null,
    createdBy: string,
    createdAt: Date,
  ): MaterialMovement {
    return new MaterialMovement(id, materialId, delta, reason, jobId, notes, createdBy, createdAt);
  }

  get id(): MaterialMovementId { return this._id; }
  get materialId(): string { return this._materialId; }
  get delta(): number { return this._delta; }
  get reason(): MaterialMovementReason { return this._reason; }
  get jobId(): string | null { return this._jobId; }
  get notes(): string | null { return this._notes; }
  get createdBy(): string { return this._createdBy; }
  get createdAt(): Date { return this._createdAt; }
}
