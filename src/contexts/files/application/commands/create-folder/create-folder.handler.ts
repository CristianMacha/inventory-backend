import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { CreateFolderCommand } from './create-folder.command';
import { IFolderRepository } from '@contexts/files/domain/repositories/folder.repository';
import { Folder } from '@contexts/files/domain/entities/folder';
import { FolderId } from '@contexts/files/domain/value-objects/folder-id';
import { FolderNotFoundException } from '@contexts/files/domain/errors/folder-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler implements ICommandHandler<CreateFolderCommand> {
  constructor(
    @Inject(FILES_TOKENS.FOLDER_REPOSITORY)
    private readonly folderRepository: IFolderRepository,
  ) {}

  async execute(command: CreateFolderCommand): Promise<{ id: string }> {
    const { name, organizationId, createdByUserId, parentId } = command;

    let parentFolderId: FolderId | null = null;
    if (parentId) {
      const parent = await this.folderRepository.findById(
        FolderId.create(parentId),
      );
      if (!parent || parent.organizationId !== organizationId) {
        throw new FolderNotFoundException(parentId);
      }
      parentFolderId = parent.id;
    }

    const folder = Folder.create(
      name,
      organizationId,
      createdByUserId,
      parentFolderId,
    );
    await this.folderRepository.save(folder);
    return { id: folder.id.getValue() };
  }
}
