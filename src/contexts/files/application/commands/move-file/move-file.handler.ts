import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { MoveFileCommand } from './move-file.command';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FileNotFoundException } from '@contexts/files/domain/errors/file-not-found.exception';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@CommandHandler(MoveFileCommand)
export class MoveFileHandler implements ICommandHandler<MoveFileCommand> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(command: MoveFileCommand): Promise<void> {
    const { fileId, targetFolderId, organizationId } = command;

    const file = await this.fileRecordRepository.findById(
      FileId.create(fileId),
    );
    if (!file || file.organizationId !== organizationId) {
      throw new FileNotFoundException(fileId);
    }

    const target = await this.folderRepository.findById(
      FolderId.create(targetFolderId),
    );
    if (!target || target.organizationId !== organizationId) {
      throw new FolderNotFoundException(targetFolderId);
    }

    file.moveTo(targetFolderId);
    await this.fileRecordRepository.save(file);
  }
}
