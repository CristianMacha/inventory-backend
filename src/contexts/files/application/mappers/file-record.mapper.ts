import { FileRecord } from '@contexts/files/domain/entities/file-record';
import { FileRecordDto } from '../dtos/file-record.dto';

export class FileRecordMapper {
  static toDto(file: FileRecord): FileRecordDto {
    return {
      id: file.id.getValue(),
      name: file.name,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      folderId: file.folderId,
      organizationId: file.organizationId,
      createdByUserId: file.createdByUserId,
      tags: file.tags,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
