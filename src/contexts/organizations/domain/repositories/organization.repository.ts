import { Organization } from '../entities/organization';
import { OrganizationId } from '../value-objects/organization-id';

export interface IOrganizationRepository {
  findById(id: OrganizationId): Promise<Organization | null>;
  findAll(): Promise<Organization[]>;
  save(organization: Organization): Promise<void>;
}
