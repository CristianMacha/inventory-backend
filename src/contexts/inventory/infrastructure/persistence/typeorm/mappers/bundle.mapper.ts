import { Bundle } from '@contexts/inventory/domain/entities/bundle';
import { BundleId } from '@contexts/inventory/domain/value-objects/bundle-id';
import { ProductId } from '@contexts/inventory/domain/value-objects/product-id';
import { SupplierId } from '@contexts/inventory/domain/value-objects/supplier-id';
import { BundleEntity } from '../entities/bundle.entity';

export class BundleMapper {
  static toDomain(entity: BundleEntity): Bundle {
    return Bundle.reconstitute(
      BundleId.create(entity.id),
      ProductId.create(entity.productId),
      SupplierId.create(entity.supplierId),
      entity.lotNumber,
      Number(entity.thicknessCm),
      entity.createdBy,
      entity.updatedBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Bundle): BundleEntity {
    const entity = new BundleEntity();
    entity.id = domain.id.getValue();
    entity.productId = domain.productId.getValue();
    entity.supplierId = domain.supplierId.getValue();
    entity.lotNumber = domain.lotNumber;
    entity.thicknessCm = domain.thicknessCm;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
