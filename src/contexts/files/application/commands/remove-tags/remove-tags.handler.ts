import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RemoveTagsCommand } from './remove-tags.command';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FileNotFoundException } from '@contexts/files/domain/errors/file-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@CommandHandler(RemoveTagsCommand)
export class RemoveTagsHandler implements ICommandHandler<RemoveTagsCommand> {
  constructor(
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(command: RemoveTagsCommand): Promise<void> {
    const { fileId, organizationId, tags } = command;

    const file = await this.fileRecordRepository.findById(
      FileId.create(fileId),
    );
    if (!file || file.organizationId !== organizationId) {
      throw new FileNotFoundException(fileId);
    }

    file.removeTags(tags);
    await this.fileRecordRepository.save(file);
  }
}
