import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { MoveFolderCommand } from './move-folder.command';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@CommandHandler(MoveFolderCommand)
export class MoveFolderHandler implements ICommandHandler<MoveFolderCommand> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(command: MoveFolderCommand): Promise<void> {
    const { folderId, targetParentId, organizationId } = command;

    const folder = await this.folderRepository.findById(
      FolderId.create(folderId),
    );
    if (!folder || folder.organizationId !== organizationId) {
      throw new FolderNotFoundException(folderId);
    }

    let newParentId: FolderId | null = null;
    if (targetParentId) {
      if (targetParentId === folderId) {
        throw new Error('A folder cannot be moved into itself');
      }
      const target = await this.folderRepository.findById(
        FolderId.create(targetParentId),
      );
      if (!target || target.organizationId !== organizationId) {
        throw new FolderNotFoundException(targetParentId);
      }
      newParentId = target.id;
    }

    folder.moveToParent(newParentId);
    await this.folderRepository.save(folder);
  }
}
