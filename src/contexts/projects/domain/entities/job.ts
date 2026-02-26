import { AggregateRoot } from '@nestjs/cqrs';
import { JobId } from '../value-objects/job-id';
import { JobStatus } from '../enums/job-status.enum';
import { JobItem } from './job-item';
import { InvalidProjectNameException } from '../errors/invalid-project-name.exception';
import { InvalidJobTransitionException } from '../errors/invalid-job-transition.exception';
import { EmptyJobItemsException } from '../errors/empty-job-items.exception';
import { JobApprovedEvent } from '../events/job-approved.event';
import { JobCompletedEvent } from '../events/job-completed.event';
import { JobCancelledEvent } from '../events/job-cancelled.event';

export class Job extends AggregateRoot {
  private readonly _id: JobId;
  private _projectName: string;
  private _clientName: string;
  private _clientPhone: string;
  private _clientEmail: string;
  private _clientAddress: string;
  private _status: JobStatus;
  private _scheduledDate: Date | null;
  private _completedDate: Date | null;
  private _notes: string;
  private _subtotal: number;
  private _taxAmount: number;
  private _totalAmount: number;
  private _items: JobItem[];
  private readonly _createdBy: string;
  private _updatedBy: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: JobId,
    projectName: string,
    clientName: string,
    clientPhone: string,
    clientEmail: string,
    clientAddress: string,
    status: JobStatus,
    scheduledDate: Date | null,
    completedDate: Date | null,
    notes: string,
    subtotal: number,
    taxAmount: number,
    totalAmount: number,
    items: JobItem[],
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this._id = id;
    this._projectName = projectName;
    this._clientName = clientName;
    this._clientPhone = clientPhone;
    this._clientEmail = clientEmail;
    this._clientAddress = clientAddress;
    this._status = status;
    this._scheduledDate = scheduledDate;
    this._completedDate = completedDate;
    this._notes = notes;
    this._subtotal = subtotal;
    this._taxAmount = taxAmount;
    this._totalAmount = totalAmount;
    this._items = items;
    this._createdBy = createdBy;
    this._updatedBy = updatedBy;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateProjectName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidProjectNameException();
    }
  }

  static create(
    projectName: string,
    clientName: string,
    clientPhone: string,
    clientEmail: string,
    clientAddress: string,
    notes: string,
    createdBy: string,
    scheduledDate?: Date | null,
  ): Job {
    Job.validateProjectName(projectName);
    const now = new Date();
    return new Job(
      JobId.generate(),
      projectName,
      clientName,
      clientPhone,
      clientEmail,
      clientAddress,
      JobStatus.QUOTED,
      scheduledDate ?? null,
      null,
      notes,
      0,
      0,
      0,
      [],
      createdBy,
      createdBy,
      now,
      now,
    );
  }

  static reconstitute(
    id: JobId,
    projectName: string,
    clientName: string,
    clientPhone: string,
    clientEmail: string,
    clientAddress: string,
    status: JobStatus,
    scheduledDate: Date | null,
    completedDate: Date | null,
    notes: string,
    subtotal: number,
    taxAmount: number,
    totalAmount: number,
    items: JobItem[],
    createdBy: string,
    updatedBy: string,
    createdAt: Date,
    updatedAt: Date,
  ): Job {
    return new Job(
      id,
      projectName,
      clientName,
      clientPhone,
      clientEmail,
      clientAddress,
      status,
      scheduledDate,
      completedDate,
      notes,
      subtotal,
      taxAmount,
      totalAmount,
      items,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    );
  }

  public addItem(
    slabId: string,
    description: string,
    unitPrice: number,
    userId: string,
  ): JobItem {
    const item = JobItem.create(this._id, slabId, description, unitPrice);
    this._items.push(item);
    this.recalculateTotals();
    this._updatedBy = userId;
    this._updatedAt = new Date();
    return item;
  }

  public removeItem(itemId: string, userId: string): void {
    this._items = this._items.filter((item) => item.id.getValue() !== itemId);
    this.recalculateTotals();
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public approve(userId: string): void {
    if (this._status !== JobStatus.QUOTED) {
      throw new InvalidJobTransitionException(this._status, JobStatus.APPROVED);
    }
    if (this._items.length === 0) {
      throw new EmptyJobItemsException();
    }
    this._status = JobStatus.APPROVED;
    this._updatedBy = userId;
    this._updatedAt = new Date();
    this.apply(
      new JobApprovedEvent(
        this._id.getValue(),
        this._items.map((item) => item.slabId),
      ),
    );
  }

  public start(userId: string): void {
    if (this._status !== JobStatus.APPROVED) {
      throw new InvalidJobTransitionException(
        this._status,
        JobStatus.IN_PROGRESS,
      );
    }
    this._status = JobStatus.IN_PROGRESS;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public complete(userId: string): void {
    if (this._status !== JobStatus.IN_PROGRESS) {
      throw new InvalidJobTransitionException(
        this._status,
        JobStatus.COMPLETED,
      );
    }
    this._status = JobStatus.COMPLETED;
    this._completedDate = new Date();
    this._updatedBy = userId;
    this._updatedAt = new Date();
    this.apply(
      new JobCompletedEvent(
        this._id.getValue(),
        this._items.map((item) => item.slabId),
      ),
    );
  }

  public cancel(userId: string): void {
    if (this._status === JobStatus.COMPLETED) {
      throw new InvalidJobTransitionException(
        this._status,
        JobStatus.CANCELLED,
      );
    }
    const wasApprovedOrInProgress =
      this._status === JobStatus.APPROVED ||
      this._status === JobStatus.IN_PROGRESS;
    this._status = JobStatus.CANCELLED;
    this._updatedBy = userId;
    this._updatedAt = new Date();
    if (wasApprovedOrInProgress && this._items.length > 0) {
      this.apply(
        new JobCancelledEvent(
          this._id.getValue(),
          this._items.map((item) => item.slabId),
        ),
      );
    }
  }

  public updateProjectName(name: string, userId: string): void {
    Job.validateProjectName(name);
    this._projectName = name;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateClientInfo(
    clientName: string,
    clientPhone: string,
    clientEmail: string,
    clientAddress: string,
    userId: string,
  ): void {
    this._clientName = clientName;
    this._clientPhone = clientPhone;
    this._clientEmail = clientEmail;
    this._clientAddress = clientAddress;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateScheduledDate(date: Date | null, userId: string): void {
    this._scheduledDate = date;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateTaxAmount(taxAmount: number, userId: string): void {
    this._taxAmount = taxAmount;
    this._totalAmount = this._subtotal + this._taxAmount;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  public updateNotes(notes: string, userId: string): void {
    this._notes = notes;
    this._updatedBy = userId;
    this._updatedAt = new Date();
  }

  private recalculateTotals(): void {
    this._subtotal = this._items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    this._totalAmount = this._subtotal + this._taxAmount;
  }

  get id(): JobId {
    return this._id;
  }
  get projectName(): string {
    return this._projectName;
  }
  get clientName(): string {
    return this._clientName;
  }
  get clientPhone(): string {
    return this._clientPhone;
  }
  get clientEmail(): string {
    return this._clientEmail;
  }
  get clientAddress(): string {
    return this._clientAddress;
  }
  get status(): JobStatus {
    return this._status;
  }
  get scheduledDate(): Date | null {
    return this._scheduledDate;
  }
  get completedDate(): Date | null {
    return this._completedDate;
  }
  get notes(): string {
    return this._notes;
  }
  get subtotal(): number {
    return this._subtotal;
  }
  get taxAmount(): number {
    return this._taxAmount;
  }
  get totalAmount(): number {
    return this._totalAmount;
  }
  get items(): ReadonlyArray<JobItem> {
    return this._items;
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
