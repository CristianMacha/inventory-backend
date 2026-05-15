import { Folder } from '../entities/folder';
import { FolderId } from '../value-objects/folder-id';

export interface IFolderRepository {
  findById(id: FolderId): Promise<Folder | null>;
  findRootFolders(organizationId: string): Promise<Folder[]>;
  findByOrganization(organizationId: string): Promise<Folder[]>;
  searchByName(organizationId: string, name: string): Promise<Folder[]>;
  findChildren(parentId: FolderId, organizationId: string): Promise<Folder[]>;
  hasChildren(folderId: FolderId): Promise<boolean>;
  save(folder: Folder): Promise<void>;
  delete(id: FolderId): Promise<void>;
}
