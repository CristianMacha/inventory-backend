import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFileUrlQuery } from './get-file-url.query';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FileNotFoundException } from '@contexts/files/domain/errors/file-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';

@QueryHandler(GetFileUrlQuery)
export class GetFileUrlHandler implements IQueryHandler<GetFileUrlQuery> {
  constructor(
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
    @Inject(STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE)
    private readonly storageService: FirebaseStorageService,
  ) {}

  async execute(query: GetFileUrlQuery): Promise<{ url: string }> {
    const { fileId, organizationId } = query;

    const file = await this.fileRecordRepository.findById(
      FileId.create(fileId),
    );
    if (!file || file.organizationId !== organizationId) {
      throw new FileNotFoundException(fileId);
    }

    const url = await this.storageService.getSignedUrl(file.storageKey);
    return { url };
  }
}
