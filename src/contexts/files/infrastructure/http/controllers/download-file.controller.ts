import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { IFileRecordRepository } from '@contexts/files/domain/repositories/file-record.repository';
import { FileId } from '@contexts/files/domain/value-objects/file-id';
import { FILES_TOKENS } from '@contexts/files/files.tokens';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class DownloadFileController {
  constructor(
    @Inject(FILES_TOKENS.FILE_RECORD_REPOSITORY)
    private readonly fileRecordRepository: IFileRecordRepository,
    @Inject(STORAGE_TOKENS.FIREBASE_STORAGE_SERVICE)
    private readonly storageService: FirebaseStorageService,
  ) {}

  @Get(':fileId/download')
  @RequirePermissions(Permissions.FILES.READ)
  @ApiOperation({
    summary: 'Download a file',
    description:
      'Streams the file content directly. Sets Content-Disposition: attachment so the browser triggers a download.',
  })
  @ApiParam({ name: 'fileId', description: 'File UUID' })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID',
  })
  @ApiResponse({ status: 200, description: 'File stream.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.read permission.',
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  async run(
    @Param('fileId') fileId: string,
    @Query('organizationId') organizationId: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.fileRecordRepository.findById(
      FileId.create(fileId),
    );
    if (!file || file.organizationId !== organizationId) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.name)}"`,
    );
    res.setHeader('Content-Length', file.sizeBytes);

    const stream = this.storageService.getReadStream(file.storageKey);
    stream.pipe(res);
  }
}
