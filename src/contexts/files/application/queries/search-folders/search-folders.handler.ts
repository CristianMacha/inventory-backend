import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { SearchFoldersQuery } from './search-folders.query';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { FolderMapper } from '@contexts/files/application/mappers/folder.mapper';
import { FolderDto } from '@contexts/files/application/dtos/folder.dto';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@QueryHandler(SearchFoldersQuery)
export class SearchFoldersHandler implements IQueryHandler<SearchFoldersQuery> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(query: SearchFoldersQuery): Promise<FolderDto[]> {
    const folders = await this.folderRepository.searchByName(
      query.organizationId,
      query.name,
    );
    return folders.map(FolderMapper.toDto);
  }
}
