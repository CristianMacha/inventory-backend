import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IToolMovementRepository } from '../../../../domain/repositories/itool-movement.repository';
import { ToolMovement } from '../../../../domain/entities/tool-movement.entity';
import { ToolMovementTypeormEntity } from '../entities/tool-movement.typeorm.entity';
import { ToolMovementPersistenceMapper } from '../mappers/tool-movement-persistence.mapper';
import {
  PaginatedResult,
  buildPaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@Injectable()
export class TypeOrmToolMovementRepository implements IToolMovementRepository {
  constructor(
    @InjectRepository(ToolMovementTypeormEntity)
    private readonly repository: Repository<ToolMovementTypeormEntity>,
  ) {}

  async findByTool(
    toolId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ToolMovement>> {
    const { page, limit } = pagination;
    const [entities, total] = await this.repository.findAndCount({
      where: { toolId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return buildPaginatedResult(
      entities.map((e) => ToolMovementPersistenceMapper.toDomain(e)),
      total,
      page,
      limit,
    );
  }

  async save(movement: ToolMovement): Promise<void> {
    await this.repository.save(
      ToolMovementPersistenceMapper.toPersistence(movement),
    );
  }
}
