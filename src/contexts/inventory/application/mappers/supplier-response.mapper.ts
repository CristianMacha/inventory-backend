import { Supplier } from '@contexts/inventory/domain/entities/supplier';
import { ISupplierOutputDto } from '@contexts/inventory/application/dtos/supplier-output.dto';

export class SupplierResponseMapper {
  public static toResponse(supplier: Supplier): ISupplierOutputDto {
    return {
      id: supplier.id.getValue(),
      name: supplier.name,
      abbreviation: supplier.abbreviation,
      isActive: supplier.isActive,
      createdBy: supplier.createdBy,
      updatedBy: supplier.updatedBy,
      createdAt: supplier.createdAt.toISOString(),
      updatedAt: supplier.updatedAt.toISOString(),
    };
  }
}
