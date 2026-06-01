import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetRootFoldersQuery } from './get-root-folders.query';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { FolderDto } from '@contexts/files/application/dtos/folder.dto';
import { FolderMapper } from '@contexts/files/application/mappers/folder.mapper';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@QueryHandler(GetRootFoldersQuery)
export class GetRootFoldersHandler implements IQueryHandler<GetRootFoldersQuery> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(query: GetRootFoldersQuery): Promise<FolderDto[]> {
    const folders = await this.folderRepository.findRootFolders(
      query.organizationId,
    );
    return folders.map((folder) => FolderMapper.toDto(folder));
  }
}
