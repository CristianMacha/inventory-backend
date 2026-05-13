import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  FileSearchParams,
  IFileRecordRepository,
} from '@contexts/files/domain/repositories/file-record.repository';
import { FileRecord } from '@contexts/files/domain/entities/file-record';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FileRecordEntity } from '../entities/file-record.entity';
import { FileRecordPersistenceMapper } from '../mappers/file-record.mapper';
import {
  buildPaginatedResult,
  PaginatedResult,
} from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@Injectable()
export class TypeOrmFileRecordRepository implements IFileRecordRepository {
  constructor(
    @InjectRepository(FileRecordEntity)
    private readonly repo: Repository<FileRecordEntity>,
  ) {}

  async findById(id: FileId): Promise<FileRecord | null> {
    const entity = await this.repo.findOne({ where: { id: id.getValue() } });
    return entity ? FileRecordPersistenceMapper.toDomain(entity) : null;
  }

  async findByFolder(
    folderId: string,
    organizationId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<FileRecord>> {
    const { page, limit } = pagination;
    const [entities, total] = await this.repo.findAndCount({
      where: { folderId, organizationId },
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return buildPaginatedResult(
      entities.map(FileRecordPersistenceMapper.toDomain),
      total,
      page,
      limit,
    );
  }

  async search(params: FileSearchParams): Promise<PaginatedResult<FileRecord>> {
    const { organizationId, tags, name, mimeType, folderId, pagination } =
      params;
    const { page, limit } = pagination;

    const qb = this.repo
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.tags', 't')
      .where('f.organizationId = :organizationId', { organizationId })
      .andWhere('f.deletedAt IS NULL');

    if (name) {
      qb.andWhere('f.name LIKE :name', { name: `%${name}%` });
    }

    if (mimeType) {
      qb.andWhere('f.mimeType LIKE :mimeType', { mimeType: `${mimeType}%` });
    }

    if (folderId) {
      qb.andWhere('f.folderId = :folderId', { folderId });
    }

    if (tags && tags.length > 0) {
      qb.andWhere(
        'f.id IN (SELECT ft.fileId FROM file_tags ft WHERE ft.tag IN (:...tags))',
        { tags: tags.map((t) => t.toLowerCase()) },
      );
    }

    qb.orderBy('f.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    return buildPaginatedResult(
      entities.map(FileRecordPersistenceMapper.toDomain),
      total,
      page,
      limit,
    );
  }

  async countByFolder(
    folderId: string,
    organizationId: string,
  ): Promise<number> {
    return this.repo.count({ where: { folderId, organizationId } });
  }

  async save(file: FileRecord): Promise<void> {
    await this.repo.save(FileRecordPersistenceMapper.toPersistence(file));
  }

  async delete(id: FileId): Promise<void> {
    await this.repo.delete(id.getValue());
  }
}
