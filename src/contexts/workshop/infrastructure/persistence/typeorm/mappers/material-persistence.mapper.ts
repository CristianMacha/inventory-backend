import { Material } from '../../../../domain/entities/material.entity';
import { MaterialId } from '../../../../domain/value-objects/material-id';
import { MaterialTypeormEntity } from '../entities/material.typeorm.entity';

export class MaterialPersistenceMapper {
  static toDomain(entity: MaterialTypeormEntity): Material {
    return Material.reconstitute(
      MaterialId.create(entity.id),
      entity.name,
      entity.description,
      entity.unit,
      Number(entity.minStock),
      entity.unitPrice !== null ? Number(entity.unitPrice) : null,
      entity.categoryId,
      entity.supplierId,
      entity.imagePublicId,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Material): MaterialTypeormEntity {
    const entity = new MaterialTypeormEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.description = domain.description;
    entity.unit = domain.unit;
    entity.minStock = domain.minStock;
    entity.unitPrice = domain.unitPrice;
    entity.categoryId = domain.categoryId;
    entity.supplierId = domain.supplierId;
    entity.imagePublicId = domain.imagePublicId;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
