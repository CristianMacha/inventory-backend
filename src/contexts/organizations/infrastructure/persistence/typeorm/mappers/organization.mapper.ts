import { Organization } from '@contexts/organizations/domain/entities/organization';
import { OrganizationId } from '@contexts/organizations/domain/value-objects/organization-id';
import { OrganizationEntity } from '../entities/organization.entity';

export class OrganizationPersistenceMapper {
  static toDomain(entity: OrganizationEntity): Organization {
    return Organization.reconstitute(
      OrganizationId.create(entity.id),
      entity.name,
      Number(entity.storageLimitBytes),
      Number(entity.storageUsedBytes),
      entity.createdBy,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Organization): OrganizationEntity {
    const entity = new OrganizationEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.storageLimitBytes = domain.storageLimitBytes;
    entity.storageUsedBytes = domain.storageUsedBytes;
    entity.createdBy = domain.createdBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
