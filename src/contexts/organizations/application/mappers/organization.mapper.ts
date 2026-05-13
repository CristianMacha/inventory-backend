import { Organization } from '@contexts/organizations/domain/entities/organization';
import { OrganizationDto } from '../dtos/organization.dto';

export class OrganizationMapper {
  static toDto(org: Organization): OrganizationDto {
    return {
      id: org.id.getValue(),
      name: org.name,
      storageLimitBytes: org.storageLimitBytes,
      storageUsedBytes: org.storageUsedBytes,
      createdBy: org.createdBy,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }
}
