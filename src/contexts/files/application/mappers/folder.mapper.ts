import { Folder } from '@contexts/files/domain/entities/folder';
import { FolderDto } from '../dtos/folder.dto';

export class FolderMapper {
  static toDto(folder: Folder): FolderDto {
    return {
      id: folder.id.getValue(),
      name: folder.name,
      parentId: folder.parentId ? folder.parentId.getValue() : null,
      organizationId: folder.organizationId,
      createdByUserId: folder.createdByUserId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
  }
}
