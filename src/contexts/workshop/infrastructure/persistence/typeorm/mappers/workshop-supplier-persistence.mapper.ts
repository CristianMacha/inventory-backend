import { WorkshopSupplier } from '../../../../domain/entities/workshop-supplier.entity';
import { WorkshopSupplierId } from '../../../../domain/value-objects/workshop-supplier-id';
import { WorkshopSupplierTypeormEntity } from '../entities/workshop-supplier.typeorm.entity';

export class WorkshopSupplierPersistenceMapper {
  static toDomain(entity: WorkshopSupplierTypeormEntity): WorkshopSupplier {
    return WorkshopSupplier.reconstitute(
      WorkshopSupplierId.create(entity.id),
      entity.name,
      entity.phone,
      entity.email,
      entity.address,
      entity.notes,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(
    domain: WorkshopSupplier,
  ): WorkshopSupplierTypeormEntity {
    const entity = new WorkshopSupplierTypeormEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.phone = domain.phone;
    entity.email = domain.email;
    entity.address = domain.address;
    entity.notes = domain.notes;
    entity.isActive = domain.isActive;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
