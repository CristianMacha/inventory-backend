import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  IWorkshopRequestRepository,
  FindRequestsFilter,
} from '../../../../domain/repositories/iworkshop-request.repository';
import { WorkshopRequest } from '../../../../domain/entities/workshop-request.entity';
import { WorkshopRequestId } from '../../../../domain/value-objects/workshop-request-id';
import { RequestStatus } from '../../../../domain/enums/request-status.enum';
import { RequestType } from '../../../../domain/enums/request-type.enum';
import { WorkshopRequestTypeormEntity } from '../entities/workshop-request.typeorm.entity';
import { WorkshopRequestPersistenceMapper } from '../mappers/workshop-request-persistence.mapper';
import {
  PaginatedResult,
  buildPaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@Injectable()
export class TypeOrmWorkshopRequestRepository implements IWorkshopRequestRepository {
  constructor(
    @InjectRepository(WorkshopRequestTypeormEntity)
    private readonly repository: Repository<WorkshopRequestTypeormEntity>,
  ) {}

  async findAll(
    filter: FindRequestsFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<WorkshopRequest>> {
    const { page, limit } = pagination;
    const where: FindOptionsWhere<WorkshopRequestTypeormEntity> = {};
    if (filter.status !== undefined) where.status = filter.status;
    if (filter.requestType !== undefined)
      where.requestType = filter.requestType;
    if (filter.requestedBy !== undefined)
      where.requestedBy = filter.requestedBy;

    const [entities, total] = await this.repository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return buildPaginatedResult(
      entities.map((e) => WorkshopRequestPersistenceMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async findById(id: WorkshopRequestId): Promise<WorkshopRequest | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? WorkshopRequestPersistenceMapper.toDomain(entity) : null;
  }

  async findApprovedMaterialRequests(): Promise<WorkshopRequest[]> {
    const entities = await this.repository.find({
      where: {
        status: RequestStatus.APPROVED,
        requestType: RequestType.MATERIAL,
      },
      order: { createdAt: 'ASC' },
    });
    return entities.map((e) => WorkshopRequestPersistenceMapper.toDomain(e));
  }

  async save(request: WorkshopRequest): Promise<void> {
    await this.repository.save(
      WorkshopRequestPersistenceMapper.toPersistence(request),
    );
  }
}
