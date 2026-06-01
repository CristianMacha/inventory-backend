import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { Folder } from '@contexts/files/domain/entities/folder';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderEntity } from '../entities/folder.entity';
import { FolderPersistenceMapper } from '../mappers/folder.mapper';

@Injectable()
export class TypeOrmFolderRepository implements IFolderRepository {
  constructor(
    @InjectRepository(FolderEntity)
    private readonly repo: Repository<FolderEntity>,
  ) {}

  async findById(id: FolderId): Promise<Folder | null> {
    const entity = await this.repo.findOne({ where: { id: id.getValue() } });
    return entity ? FolderPersistenceMapper.toDomain(entity) : null;
  }

  async findRootFolders(organizationId: string): Promise<Folder[]> {
    const entities = await this.repo.find({
      where: { organizationId, parentId: IsNull() },
      order: { name: 'ASC' },
    });
    return entities.map((entity) => FolderPersistenceMapper.toDomain(entity));
  }

  async findByOrganization(organizationId: string): Promise<Folder[]> {
    const entities = await this.repo.find({
      where: { organizationId },
      order: { name: 'ASC' },
    });
    return entities.map((entity) => FolderPersistenceMapper.toDomain(entity));
  }

  async searchByName(organizationId: string, name: string): Promise<Folder[]> {
    const entities = await this.repo
      .createQueryBuilder('f')
      .where('f.organizationId = :organizationId', { organizationId })
      .andWhere('f.name LIKE :name', { name: `%${name}%` })
      .orderBy('f.name', 'ASC')
      .getMany();
    return entities.map((entity) => FolderPersistenceMapper.toDomain(entity));
  }

  async findChildren(
    parentId: FolderId,
    organizationId: string,
  ): Promise<Folder[]> {
    const entities = await this.repo.find({
      where: { parentId: parentId.getValue(), organizationId },
      order: { name: 'ASC' },
    });
    return entities.map((entity) => FolderPersistenceMapper.toDomain(entity));
  }

  async hasChildren(folderId: FolderId): Promise<boolean> {
    const count = await this.repo.count({
      where: { parentId: folderId.getValue() },
    });
    return count > 0;
  }

  async save(folder: Folder): Promise<void> {
    await this.repo.save(FolderPersistenceMapper.toPersistence(folder));
  }

  async delete(id: FolderId): Promise<void> {
    await this.repo.delete(id.getValue());
  }
}
