import { FileRecord } from '../entities/file-record';
import { FileId } from '../value-objects/file-id';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { PaginationParams } from '@shared/domain/pagination/pagination-params.interface';

export interface FileSearchParams {
  organizationId: string;
  tags?: string[];
  name?: string;
  mimeType?: string;
  folderId?: string;
  pagination: PaginationParams;
}

export interface IFileRecordRepository {
  findById(id: FileId): Promise<FileRecord | null>;
  findByFolder(
    folderId: string,
    organizationId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<FileRecord>>;
  search(params: FileSearchParams): Promise<PaginatedResult<FileRecord>>;
  countByFolder(folderId: string, organizationId: string): Promise<number>;
  save(file: FileRecord): Promise<void>;
  delete(id: FileId): Promise<void>;
}
