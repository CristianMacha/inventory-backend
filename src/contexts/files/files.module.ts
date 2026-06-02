import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FILES_TOKENS } from './files.tokens';
import { OrganizationsModule } from '@contexts/organizations/organizations.module';
import { UsersModule } from '@contexts/users/users.module';

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
import { RenameFolderHandler } from './application/commands/rename-folder/rename-folder.handler';
import { MoveFolderHandler } from './application/commands/move-folder/move-folder.handler';
import { RenameFileHandler } from './application/commands/rename-file/rename-file.handler';
import { BulkMoveFilesHandler } from './application/commands/bulk-move-files/bulk-move-files.handler';

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
import { RenameFolderController } from './infrastructure/http/controllers/rename-folder.controller';
import { MoveFolderController } from './infrastructure/http/controllers/move-folder.controller';
import { RenameFileController } from './infrastructure/http/controllers/rename-file.controller';
import { GetFileController } from './infrastructure/http/controllers/get-file.controller';
import { GetFileHandler } from './application/queries/get-file/get-file.handler';
import { GetFolderHandler } from './application/queries/get-folder/get-folder.handler';
import { SearchFoldersHandler } from './application/queries/search-folders/search-folders.handler';
import { GetFileDownloadMetaHandler } from './application/queries/get-file-download-meta/get-file-download-meta.handler';
import { GetFolderController } from './infrastructure/http/controllers/get-folder.controller';
import { SearchFoldersController } from './infrastructure/http/controllers/search-folders.controller';
import { BulkMoveFilesController } from './infrastructure/http/controllers/bulk-move-files.controller';
import { DownloadFileController } from './infrastructure/http/controllers/download-file.controller';

const CommandHandlers = [
  CreateFolderHandler,
  UploadFileHandler,
  AddTagsHandler,
  RemoveTagsHandler,
  MoveFileHandler,
  DeleteFileHandler,
  DeleteFolderHandler,
  RenameFolderHandler,
  MoveFolderHandler,
  RenameFileHandler,
  BulkMoveFilesHandler,
];

const QueryHandlers = [
  GetFolderContentsHandler,
  GetRootFoldersHandler,
  SearchFilesHandler,
  GetFileUrlHandler,
  GetFileHandler,
  GetFolderHandler,
  SearchFoldersHandler,
  GetFileDownloadMetaHandler,
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
    UsersModule,
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
    RenameFolderController,
    MoveFolderController,
    RenameFileController,
    GetFileController,
    GetFolderController,
    SearchFoldersController,
    BulkMoveFilesController,
    DownloadFileController,
  ],
  providers: [...CommandHandlers, ...QueryHandlers, ...PersistenceProviders],
})
export class FilesModule {}
