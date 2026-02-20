import { Supplier } from '../entities/supplier';
import { SupplierId } from '../value-objects/supplier-id';

export interface ISupplierRepository {
  findAll(): Promise<Supplier[]>;
  findAllActive(): Promise<Supplier[]>;
  findById(id: SupplierId): Promise<Supplier | null>;
  findByName(name: string): Promise<Supplier | null>;
  save(supplier: Supplier): Promise<void>;
  count(): Promise<number>;
}
