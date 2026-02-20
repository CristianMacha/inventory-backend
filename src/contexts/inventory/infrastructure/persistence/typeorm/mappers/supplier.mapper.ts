import { Supplier } from '@contexts/inventory/domain/entities/supplier';
import { SupplierEntity } from '../entities/supplier.entity';
import { SupplierId } from '@contexts/inventory/domain/value-objects/supplier-id';

export class SupplierMapper {
  static toDomain(entity: SupplierEntity): Supplier {
    return Supplier.reconstitute(
      SupplierId.create(entity.id),
      entity.name,
      entity.abbreviation,
      entity.isActive,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Supplier): SupplierEntity {
    const entity = new SupplierEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.abbreviation = domain.abbreviation;
    entity.isActive = domain.isActive;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
