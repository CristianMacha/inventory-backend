import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IOrganizationRepository } from '@contexts/organizations/domain/repositories/organization.repository';
import { Organization } from '@contexts/organizations/domain/entities/organization';
import { OrganizationId } from '@contexts/organizations/domain/value-objects/organization-id';
import { OrganizationEntity } from '../entities/organization.entity';
import { OrganizationPersistenceMapper } from '../mappers/organization.mapper';

@Injectable()
export class TypeOrmOrganizationRepository implements IOrganizationRepository {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly repo: Repository<OrganizationEntity>,
  ) {}

  async findById(id: OrganizationId): Promise<Organization | null> {
    const entity = await this.repo.findOne({ where: { id: id.getValue() } });
    return entity ? OrganizationPersistenceMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Organization[]> {
    const entities = await this.repo.find({ order: { name: 'ASC' } });
    return entities.map(OrganizationPersistenceMapper.toDomain);
  }

  async save(organization: Organization): Promise<void> {
    await this.repo.save(
      OrganizationPersistenceMapper.toPersistence(organization),
    );
  }
}
