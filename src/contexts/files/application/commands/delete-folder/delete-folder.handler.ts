import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { DeleteFolderCommand } from './delete-folder.command';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { FolderNotEmptyException } from '@contexts/files/domain/errors/folder-not-empty.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';
import { normalizePaginationParams } from '@shared/domain/pagination/pagination-params.interface';

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderHandler implements ICommandHandler<DeleteFolderCommand> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(command: DeleteFolderCommand): Promise<void> {
    const { folderId, organizationId } = command;

    const folder = await this.folderRepository.findById(
      FolderId.create(folderId),
    );
    if (!folder || folder.organizationId !== organizationId) {
      throw new FolderNotFoundException(folderId);
    }

    const hasSubfolders = await this.folderRepository.hasChildren(folder.id);
    const fileCount = await this.fileRecordRepository.countByFolder(
      folderId,
      organizationId,
    );

    if (hasSubfolders || fileCount > 0) {
      throw new FolderNotEmptyException(folderId);
    }

    await this.folderRepository.delete(folder.id);
  }
}
