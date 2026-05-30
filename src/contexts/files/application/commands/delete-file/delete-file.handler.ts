import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { DeleteFileCommand } from './delete-file.command';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { IOrganizationRepository } from '@contexts/organizations/domain/repositories/organization.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { OrganizationId } from '@contexts/organizations/domain/value-objects/organization-id';
import { FileNotFoundException } from '@contexts/files/domain/errors/file-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';
import { ORGANIZATIONS_TOKENS } from '@contexts/organizations/organizations.tokens';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
    @Inject(ORGANIZATIONS_TOKENS.ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE)
    private readonly storageService: FirebaseStorageService,
  ) {}

  async execute(command: DeleteFileCommand): Promise<void> {
    const { fileId, organizationId } = command;

    const file = await this.fileRecordRepository.findById(
      FileId.create(fileId),
    );
    if (!file || file.organizationId !== organizationId) {
      throw new FileNotFoundException(fileId);
    }

    const org = await this.organizationRepository.findById(
      OrganizationId.create(organizationId),
    );
    if (org) {
      org.freeStorage(file.sizeBytes);
      await this.organizationRepository.save(org);
    }

    await this.fileRecordRepository.delete(FileId.create(fileId));
    await this.storageService.delete(file.storageKey);
  }
}
