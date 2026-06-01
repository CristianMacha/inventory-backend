import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFolderContentsQuery } from './get-folder-contents.query';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { FolderContentsDto } from '@contexts/files/application/dtos/folder-contents.dto';
import { FolderMapper } from '@contexts/files/application/mappers/folder.mapper';
import { FileRecordMapper } from '@contexts/files/application/mappers/file-record.mapper';
import { FILES_TOKENS } from '@contexts/files/files.tokens';
import { normalizePaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@QueryHandler(GetFolderContentsQuery)
export class GetFolderContentsHandler implements IQueryHandler<GetFolderContentsQuery> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(query: GetFolderContentsQuery): Promise<FolderContentsDto> {
    const { folderId, organizationId, page, limit } = query;

    const folder = await this.folderRepository.findById(
      FolderId.create(folderId),
    );
    if (!folder || folder.organizationId !== organizationId) {
      throw new FolderNotFoundException(folderId);
    }

    const pagination = normalizePaginationParams(page, limit);
    const [subfolders, paginatedFiles] = await Promise.all([
      this.folderRepository.findChildren(folder.id, organizationId),
      this.fileRecordRepository.findByFolder(
        folderId,
        organizationId,
        pagination,
      ),
    ]);

    return {
      folder: FolderMapper.toDto(folder),
      subfolders: subfolders.map((subfolder) => FolderMapper.toDto(subfolder)),
      files: {
        ...paginatedFiles,
        data: paginatedFiles.data.map((file) => FileRecordMapper.toDto(file)),
      },
    };
  }
}
