import { FileRecord } from '@contexts/files/domain/entities/file-record';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FileRecordEntity } from '../entities/file-record.entity';
import { FileTagEntity } from '../entities/file-tag.entity';
import { v4 as uuidv4 } from 'uuid';

export class FileRecordPersistenceMapper {
  static toDomain(entity: FileRecordEntity): FileRecord {
    const tags = (entity.tags ?? []).map((t) => t.tag);
    return FileRecord.reconstitute(
      FileId.create(entity.id),
      entity.name,
      entity.storageKey,
      entity.mimeType,
      Number(entity.sizeBytes),
      entity.folderId,
      entity.organizationId,
      entity.createdByUserId,
      tags,
      entity.deletedAt ?? null,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: FileRecord): FileRecordEntity {
    const entity = new FileRecordEntity();
    entity.id = domain.id.getValue();
    entity.name = domain.name;
    entity.storageKey = domain.storageKey;
    entity.mimeType = domain.mimeType;
    entity.sizeBytes = domain.sizeBytes;
    entity.folderId = domain.folderId;
    entity.organizationId = domain.organizationId;
    entity.createdByUserId = domain.createdByUserId;
    entity.deletedAt = domain.deletedAt;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.tags = domain.tags.map((tag) => {
      const tagEntity = new FileTagEntity();
      tagEntity.id = uuidv4();
      tagEntity.fileId = domain.id.getValue();
      tagEntity.tag = tag;
      return tagEntity;
    });
    return entity;
  }
}
