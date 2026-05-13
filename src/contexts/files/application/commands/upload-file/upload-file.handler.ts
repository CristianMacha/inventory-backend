import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { UploadFileCommand } from './upload-file.command';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { IOrganizationRepository } from '@contexts/organizations/domain/repositories/organization.repository';
import { FileRecord } from '@contexts/files/domain/entities/file-record';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { OrganizationId } from '@contexts/organizations/domain/value-objects/organization-id';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { OrganizationNotFoundException } from '@contexts/organizations/domain/errors/organization-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';
import { ORGANIZATIONS_TOKENS } from '@contexts/organizations/organizations.tokens';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
    @Inject(ORGANIZATIONS_TOKENS.ORGANIZATION_REPOSITORY)
    private readonly organizationRepository: IOrganizationRepository,
    @Inject(STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE)
    private readonly storageService: FirebaseStorageService,
  ) {}

  async execute(command: UploadFileCommand): Promise<{ id: string }> {
    const { file, folderId, organizationId, uploadedByUserId } = command;

    const org = await this.organizationRepository.findById(
      OrganizationId.create(organizationId),
    );
    if (!org) throw new OrganizationNotFoundException(organizationId);

    const folder = await this.folderRepository.findById(
      FolderId.create(folderId),
    );
    if (!folder || folder.organizationId !== organizationId) {
      throw new FolderNotFoundException(folderId);
    }

    org.allocateStorage(file.size);

    const { publicId } = await this.storageService.upload(
      file,
      `organizations/${organizationId}/files`,
    );

    const fileRecord = FileRecord.create(
      file.originalname,
      publicId,
      file.mimetype,
      file.size,
      folderId,
      organizationId,
      uploadedByUserId,
    );

    await this.fileRecordRepository.save(fileRecord);
    await this.organizationRepository.save(org);

    return { id: fileRecord.id.getValue() };
  }
}
