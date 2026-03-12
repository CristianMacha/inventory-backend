import { ToolMovementId } from '../value-objects/tool-movement-id';
import { ToolStatus } from '../enums/tool-status.enum';

export class ToolMovement {
  private readonly _id: ToolMovementId;
  private readonly _toolId: string;
  private readonly _previousStatus: ToolStatus;
  private readonly _newStatus: ToolStatus;
  private readonly _jobId: string | null;
  private readonly _notes: string | null;
  private readonly _createdBy: string;
  private readonly _createdAt: Date;

  private constructor(
    id: ToolMovementId,
    toolId: string,
    previousStatus: ToolStatus,
    newStatus: ToolStatus,
    jobId: string | null,
    notes: string | null,
    createdBy: string,
    createdAt: Date,
  ) {
    this._id = id;
    this._toolId = toolId;
    this._previousStatus = previousStatus;
    this._newStatus = newStatus;
    this._jobId = jobId;
    this._notes = notes;
    this._createdBy = createdBy;
    this._createdAt = createdAt;
  }

  static create(
    toolId: string,
    previousStatus: ToolStatus,
    newStatus: ToolStatus,
    createdBy: string,
    jobId?: string,
    notes?: string,
  ): ToolMovement {
    return new ToolMovement(
      ToolMovementId.generate(),
      toolId,
      previousStatus,
      newStatus,
      jobId ?? null,
      notes ?? null,
      createdBy,
      new Date(),
    );
  }

  static reconstitute(
    id: ToolMovementId,
    toolId: string,
    previousStatus: ToolStatus,
    newStatus: ToolStatus,
    jobId: string | null,
    notes: string | null,
    createdBy: string,
    createdAt: Date,
  ): ToolMovement {
    return new ToolMovement(id, toolId, previousStatus, newStatus, jobId, notes, createdBy, createdAt);
  }

  get id(): ToolMovementId { return this._id; }
  get toolId(): string { return this._toolId; }
  get previousStatus(): ToolStatus { return this._previousStatus; }
  get newStatus(): ToolStatus { return this._newStatus; }
  get jobId(): string | null { return this._jobId; }
  get notes(): string | null { return this._notes; }
  get createdBy(): string { return this._createdBy; }
  get createdAt(): Date { return this._createdAt; }
}
