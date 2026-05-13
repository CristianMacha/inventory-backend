import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { SearchFilesQuery } from './search-files.query';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileRecordMapper } from '@contexts/files/application/mappers/file-record.mapper';
import { FILES_TOKENS } from '@contexts/files/files.tokens';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';
import { FileRecordDto } from '@contexts/files/application/dtos/file-record.dto';
import { normalizePaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@QueryHandler(SearchFilesQuery)
export class SearchFilesHandler implements IQueryHandler<SearchFilesQuery> {
  constructor(
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(
    query: SearchFilesQuery,
  ): Promise<PaginatedResult<FileRecordDto>> {
    const { organizationId, tags, name, mimeType, folderId, page, limit } =
      query;

    const pagination = normalizePaginationParams(page, limit);
    const result = await this.fileRecordRepository.search({
      organizationId,
      tags,
      name,
      mimeType,
      folderId,
      pagination,
    });

    return {
      ...result,
      data: result.data.map(FileRecordMapper.toDto),
    };
  }
}
