import { Slab } from '@contexts/inventory/domain/entities/slab';
import { SlabEntity } from '../entities/slab.entity';
import { SlabId } from '@contexts/inventory/domain/value-objects/slab-id';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { SlabDimensions } from '@contexts/inventory/domain/value-objects/slab-dimensions';

export class SlabMapper {
  static toDomain(entity: SlabEntity): Slab {
    return Slab.reconstitute(
      SlabId.create(entity.id),
      BundleId.create(entity.bundleId),
      entity.code,
      new SlabDimensions(Number(entity.widthCm), Number(entity.heightCm)),
      entity.status,
      entity.description,
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
      entity.parentSlabId ?? null,
    );
  }

  static toPersistence(domain: Slab): SlabEntity {
    const entity = new SlabEntity();
    entity.id = domain.id.getValue();
    entity.bundleId = domain.bundleId.getValue();
    entity.code = domain.code;
    entity.widthCm = domain.dimensions.width;
    entity.heightCm = domain.dimensions.height;
    entity.status = domain.status;
    entity.description = domain.description;
    entity.parentSlabId = domain.parentSlabId;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
