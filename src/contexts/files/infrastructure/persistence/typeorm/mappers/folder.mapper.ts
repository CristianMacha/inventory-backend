import { Folder } from '@contexts/files/domain/entities/folder';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderEntity } from '../entities/folder.entity';

export class FolderPersistenceMapper {
  static toDomain(entity: FolderEntity): Folder {
    return Folder.reconstitute(
      FolderId.create(entity.id),
      entity.name,
      entity.parentId ? FolderId.create(entity.parentId) : null,
      entity.organizationId,
      entity.createdByUserId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Folder): FolderEntity {
    const entity = new FolderEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.parentId = domain.parentId ? domain.parentId.getValue() : null;
    entity.organizationId = domain.organizationId;
    entity.createdByUserId = domain.createdByUserId;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
