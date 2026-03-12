import { WorkshopSupplier } from '../entities/workshop-supplier.entity';
import { WorkshopSupplierId } from '../value-objects/workshop-supplier-id';

export interface IWorkshopSupplierRepository {
  findAll(): Promise<WorkshopSupplier[]>;
  findAllActive(): Promise<WorkshopSupplier[]>;
  findById(id: WorkshopSupplierId): Promise<WorkshopSupplier | null>;
  findByName(name: string): Promise<WorkshopSupplier | null>;
  save(supplier: WorkshopSupplier): Promise<void>;
}
