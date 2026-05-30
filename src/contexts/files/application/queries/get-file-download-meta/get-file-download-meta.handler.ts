import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFileDownloadMetaQuery } from './get-file-download-meta.query';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FileNotFoundException } from '@contexts/files/domain/errors/file-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

export interface FileDownloadMeta {
  storageKey: string;
  mimeType: string;
  name: string;
  sizeBytes: number;
}

@QueryHandler(GetFileDownloadMetaQuery)
export class GetFileDownloadMetaHandler implements IQueryHandler<GetFileDownloadMetaQuery> {
  constructor(
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(query: GetFileDownloadMetaQuery): Promise<FileDownloadMeta> {
    const { fileId, organizationId } = query;

    const file = await this.fileRecordRepository.findById(
      FileId.create(fileId),
    );
    if (!file || file.organizationId !== organizationId) {
      throw new FileNotFoundException(fileId);
    }

    return {
      storageKey: file.storageKey,
      mimeType: file.mimeType,
      name: file.name,
      sizeBytes: file.sizeBytes,
    };
  }
}
