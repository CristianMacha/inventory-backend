import { WorkshopSupplier } from '../../domain/entities/workshop-supplier.entity';
import { WorkshopSupplierDto } from '../dtos/workshop-supplier.dto';

export class WorkshopSupplierMapper {
  static toDto(supplier: WorkshopSupplier): WorkshopSupplierDto {
    return {
      id: supplier.id.getValue(),
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      notes: supplier.notes,
      isActive: supplier.isActive,
      createdAt: supplier.createdAt.toISOString(),
      updatedAt: supplier.updatedAt.toISOString(),
    };
  }
}
