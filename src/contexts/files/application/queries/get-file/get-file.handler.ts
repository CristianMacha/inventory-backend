import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFileQuery } from './get-file.query';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FileNotFoundException } from '@contexts/files/domain/errors/file-not-found.exception';
import { FileRecordMapper } from '@contexts/files/application/mappers/file-record.mapper';
import { FileRecordDto } from '@contexts/files/application/dtos/file-record.dto';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@QueryHandler(GetFileQuery)
export class GetFileHandler implements IQueryHandler<GetFileQuery> {
  constructor(
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(query: GetFileQuery): Promise<FileRecordDto> {
    const { fileId, organizationId } = query;

    const file = await this.fileRecordRepository.findById(
      FileId.create(fileId),
    );
    if (!file || file.organizationId !== organizationId) {
      throw new FileNotFoundException(fileId);
    }

    return FileRecordMapper.toDto(file);
  }
}
