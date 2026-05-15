import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFolderQuery } from './get-folder.query';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { FolderMapper } from '@contexts/files/application/mappers/folder.mapper';
import { FolderDto } from '@contexts/files/application/dtos/folder.dto';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@QueryHandler(GetFolderQuery)
export class GetFolderHandler implements IQueryHandler<GetFolderQuery> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(query: GetFolderQuery): Promise<FolderDto> {
    const { folderId, organizationId } = query;

    const folder = await this.folderRepository.findById(
      FolderId.create(folderId),
    );
    if (!folder || folder.organizationId !== organizationId) {
      throw new FolderNotFoundException(folderId);
    }

    return FolderMapper.toDto(folder);
  }
}
