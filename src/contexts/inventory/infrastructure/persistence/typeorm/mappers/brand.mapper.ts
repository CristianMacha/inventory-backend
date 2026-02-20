import { Brand } from '@contexts/inventory/domain/entities/brand';
import { BrandEntity } from '../entities/brand.entity';
import { BrandId } from '@contexts/inventory/domain/value-objects/brand-id';

export class BrandMapper {
  static toDomain(entity: BrandEntity): Brand {
    return Brand.reconstitute(
      BrandId.create(entity.id),
      entity.name,
      entity.description,
      entity.isActive,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Brand): BrandEntity {
    const entity = new BrandEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.description = domain.description;
    entity.isActive = domain.isActive;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
