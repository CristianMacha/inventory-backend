import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { MoveFolderCommand } from './move-folder.command';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { DomainException } from '@shared/domain/domain.exception';
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
        throw new DomainException(
          'A folder cannot be moved into itself',
          HttpStatus.BAD_REQUEST,
        );
      }
      const target = await this.folderRepository.findById(
        FolderId.create(targetParentId),
      );
      if (!target || target.organizationId !== organizationId) {
        throw new FolderNotFoundException(targetParentId);
      }

      // Detect circular references: walk up target's ancestor chain
      const MAX_DEPTH = 100;
      let current = target;
      for (let depth = 0; depth < MAX_DEPTH; depth++) {
        const parentId = current.parentId;
        if (!parentId) break;
        if (parentId.getValue() === folderId) {
          throw new DomainException(
            'Moving this folder would create a circular reference',
            HttpStatus.BAD_REQUEST,
          );
        }
        const parent = await this.folderRepository.findById(parentId);
        if (!parent) break;
        current = parent;
      }

      newParentId = target.id;
    }

    folder.moveToParent(newParentId);
    await this.folderRepository.save(folder);
  }
}
