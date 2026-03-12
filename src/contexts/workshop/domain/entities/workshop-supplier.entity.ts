import { WorkshopSupplierId } from '../value-objects/workshop-supplier-id';
import { WorkshopItemNameEmptyException } from '../errors/workshop.errors';

export class WorkshopSupplier {
  private readonly _id: WorkshopSupplierId;
  private _name: string;
  private _phone: string | null;
  private _email: string | null;
  private _address: string | null;
  private _notes: string | null;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: WorkshopSupplierId,
    name: string,
    phone: string | null,
    email: string | null,
    address: string | null,
    notes: string | null,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._phone = phone;
    this._email = email;
    this._address = address;
    this._notes = notes;
    this._isActive = isActive;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new WorkshopItemNameEmptyException('WorkshopSupplier');
    }
  }

  static create(
    name: string,
    phone?: string,
    email?: string,
    address?: string,
    notes?: string,
  ): WorkshopSupplier {
    WorkshopSupplier.validateName(name);
    const now = new Date();
    return new WorkshopSupplier(
      WorkshopSupplierId.generate(),
      name,
      phone ?? null,
      email ?? null,
      address ?? null,
      notes ?? null,
      true,
      now,
      now,
    );
  }

  static reconstitute(
    id: WorkshopSupplierId,
    name: string,
    phone: string | null,
    email: string | null,
    address: string | null,
    notes: string | null,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): WorkshopSupplier {
    return new WorkshopSupplier(id, name, phone, email, address, notes, isActive, createdAt, updatedAt);
  }

  update(
    name?: string,
    phone?: string | null,
    email?: string | null,
    address?: string | null,
    notes?: string | null,
    isActive?: boolean,
  ): void {
    if (name !== undefined) { WorkshopSupplier.validateName(name); this._name = name; }
    if (phone !== undefined) this._phone = phone;
    if (email !== undefined) this._email = email;
    if (address !== undefined) this._address = address;
    if (notes !== undefined) this._notes = notes;
    if (isActive !== undefined) this._isActive = isActive;
    this._updatedAt = new Date();
  }

  get id(): WorkshopSupplierId { return this._id; }
  get name(): string { return this._name; }
  get phone(): string | null { return this._phone; }
  get email(): string | null { return this._email; }
  get address(): string | null { return this._address; }
  get notes(): string | null { return this._notes; }
  get isActive(): boolean { return this._isActive; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}
