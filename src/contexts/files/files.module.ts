import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FILES_TOKENS } from './files.tokens';
import { OrganizationsModule } from '@contexts/organizations/organizations.module';

import { FolderEntity } from './infrastructure/persistence/typeorm/entities/folder.entity';
import { FileRecordEntity } from './infrastructure/persistence/typeorm/entities/file-record.entity';
import { FileTagEntity } from './infrastructure/persistence/typeorm/entities/file-tag.entity';

import { TypeOrmFolderRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-folder.repository';
import { TypeOrmFileRecordRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-file-record.repository';

import { CreateFolderHandler } from './application/commands/create-folder/create-folder.handler';
import { UploadFileHandler } from './application/commands/upload-file/upload-file.handler';
import { AddTagsHandler } from './application/commands/add-tags/add-tags.handler';
import { RemoveTagsHandler } from './application/commands/remove-tags/remove-tags.handler';
import { MoveFileHandler } from './application/commands/move-file/move-file.handler';
import { DeleteFileHandler } from './application/commands/delete-file/delete-file.handler';
import { DeleteFolderHandler } from './application/commands/delete-folder/delete-folder.handler';

import { GetFolderContentsHandler } from './application/queries/get-folder-contents/get-folder-contents.handler';
import { GetRootFoldersHandler } from './application/queries/get-root-folders/get-root-folders.handler';
import { SearchFilesHandler } from './application/queries/search-files/search-files.handler';
import { GetFileUrlHandler } from './application/queries/get-file-url/get-file-url.handler';

import { CreateFolderController } from './infrastructure/http/controllers/create-folder.controller';
import { GetFolderContentsController } from './infrastructure/http/controllers/get-folder-contents.controller';
import { UploadFileController } from './infrastructure/http/controllers/upload-file.controller';
import { SearchFilesController } from './infrastructure/http/controllers/search-files.controller';
import { FileTagsController } from './infrastructure/http/controllers/file-tags.controller';
import { MoveFileController } from './infrastructure/http/controllers/move-file.controller';
import { DeleteFileController } from './infrastructure/http/controllers/delete-file.controller';
import { DeleteFolderController } from './infrastructure/http/controllers/delete-folder.controller';
import { GetFileUrlController } from './infrastructure/http/controllers/get-file-url.controller';
import { GetRootFoldersController } from './infrastructure/http/controllers/get-root-folders.controller';

const CommandHandlers = [
  CreateFolderHandler,
  UploadFileHandler,
  AddTagsHandler,
  RemoveTagsHandler,
  MoveFileHandler,
  DeleteFileHandler,
  DeleteFolderHandler,
];

const QueryHandlers = [
  GetFolderContentsHandler,
  GetRootFoldersHandler,
  SearchFilesHandler,
  GetFileUrlHandler,
];

const PersistenceProviders: Provider[] = [
  {
    provide: FILES_TOKENS.FOLDER_REPOSITORY,
    useClass: TypeOrmFolderRepository,
  },
  {
    provide: FILES_TOKENS.FILE_RECORD_REPOSITORY,
    useClass: TypeOrmFileRecordRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([FolderEntity, FileRecordEntity, FileTagEntity]),
    OrganizationsModule,
  ],
  controllers: [
    CreateFolderController,
    GetFolderContentsController,
    UploadFileController,
    SearchFilesController,
    FileTagsController,
    MoveFileController,
    DeleteFileController,
    DeleteFolderController,
    GetFileUrlController,
    GetRootFoldersController,
  ],
  providers: [...CommandHandlers, ...QueryHandlers, ...PersistenceProviders],
})
export class FilesModule {}
