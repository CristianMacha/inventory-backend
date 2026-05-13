import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { AddTagsCommand } from './add-tags.command';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FileNotFoundException } from '@contexts/files/domain/errors/file-not-found.exception';
import { FILES_TOKENS } from '@contexts/files/files.tokens';

@CommandHandler(AddTagsCommand)
export class AddTagsHandler implements ICommandHandler<AddTagsCommand> {
  constructor(
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
  ) {}

  async execute(command: AddTagsCommand): Promise<void> {
    const { fileId, organizationId, tags } = command;

    const file = await this.fileRecordRepository.findById(
      FileId.create(fileId),
    );
    if (!file || file.organizationId !== organizationId) {
      throw new FileNotFoundException(fileId);
    }

    file.addTags(tags);
    await this.fileRecordRepository.save(file);
  }
}
