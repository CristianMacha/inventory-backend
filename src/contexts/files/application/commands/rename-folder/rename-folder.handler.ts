import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RenameFolderCommand } from './rename-folder.command';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@CommandHandler(RenameFolderCommand)
export class RenameFolderHandler implements ICommandHandler<RenameFolderCommand> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(command: RenameFolderCommand): Promise<void> {
    const { folderId, name, organizationId } = command;

    const folder = await this.folderRepository.findById(
      FolderId.create(folderId),
    );

    if (!folder || folder.organizationId !== organizationId) {
      throw new FolderNotFoundException(folderId);
    }

    folder.rename(name);
    await this.folderRepository.save(folder);
  }
}
