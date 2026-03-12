import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IToolRepository } from '../../../../domain/repositories/itool.repository';
import { Tool } from '../../../../domain/entities/tool.entity';
import { ToolId } from '../../../../domain/value-objects/tool-id';
import { ToolTypeormEntity } from '../entities/tool.typeorm.entity';
import { ToolPersistenceMapper } from '../mappers/tool-persistence.mapper';
import {
  PaginatedResult,
  buildPaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@Injectable()
export class TypeOrmToolRepository implements IToolRepository {
  constructor(
    @InjectRepository(ToolTypeormEntity)
    private readonly repository: Repository<ToolTypeormEntity>,
  ) {}

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Tool>> {
    const { page, limit } = pagination;
    const [entities, total] = await this.repository.findAndCount({
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return buildPaginatedResult(
      entities.map(ToolPersistenceMapper.toDomain),
      total,
      page,
      limit,
    );
  }

  async findById(id: ToolId): Promise<Tool | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? ToolPersistenceMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Tool | null> {
    const entity = await this.repository.findOne({ where: { name } });
    return entity ? ToolPersistenceMapper.toDomain(entity) : null;
  }

  async save(tool: Tool): Promise<void> {
    await this.repository.save(ToolPersistenceMapper.toPersistence(tool));
  }

  async delete(id: ToolId): Promise<void> {
    await this.repository.softDelete(id.getValue());
  }
}
