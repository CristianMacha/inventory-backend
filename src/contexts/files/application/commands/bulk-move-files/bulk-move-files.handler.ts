import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { BulkMoveFilesCommand } from './bulk-move-files.command';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FileNotFoundException } from '@contexts/files/domain/errors/file-not-found.exception';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@CommandHandler(BulkMoveFilesCommand)
export class BulkMoveFilesHandler implements ICommandHandler<BulkMoveFilesCommand> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(command: BulkMoveFilesCommand): Promise<{ moved: number }> {
    const { fileIds, targetFolderId, organizationId } = command;

    const target = await this.folderRepository.findById(
      FolderId.create(targetFolderId),
    );
    if (!target || target.organizationId !== organizationId) {
      throw new FolderNotFoundException(targetFolderId);
    }

    const files = await Promise.all(
      fileIds.map((id) =>
        this.fileRecordRepository.findById(FileId.create(id)),
      ),
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || file.organizationId !== organizationId) {
        throw new FileNotFoundException(fileIds[i]);
      }
    }

    await Promise.all(
      files.map((file) => {
        file!.moveTo(targetFolderId);
        return this.fileRecordRepository.save(file!);
      }),
    );

    return { moved: files.length };
  }
}
