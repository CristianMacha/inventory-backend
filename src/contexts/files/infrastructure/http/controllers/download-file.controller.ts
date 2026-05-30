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
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { GetFileDownloadMetaQuery } from '@contexts/files/application/queries/get-file-download-meta/get-file-download-meta.query';
import { FileDownloadMeta } from '@contexts/files/application/queries/get-file-download-meta/get-file-download-meta.handler';
import { FirebaseStorageService } from '@shared/storage/firebase/firebase-storage.service';
import { STORAGE_TOKENS } from '@shared/storage/storage.tokens';

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files')
export class DownloadFileController {
  constructor(
    private readonly queryBus: QueryBus,
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
  @ApiResponse({ status: 200, description: 'File stream (binary). Headers: Content-Type, Content-Disposition: attachment, Content-Length.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden. Requires files.read permission or the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiResponse({ status: 500, description: 'Storage read error. The file record exists but the storage object could not be streamed.' })
  async run(
    @Param('fileId') fileId: string,
    @Query('organizationId') organizationId: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.queryBus.execute<
      GetFileDownloadMetaQuery,
      FileDownloadMeta
    >(new GetFileDownloadMetaQuery(fileId, organizationId));

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.name)}"`,
    );
    res.setHeader('Content-Length', file.sizeBytes);

    const stream = this.storageService.getReadStream(file.storageKey);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to read file from storage' });
      } else {
        res.destroy();
      }
    });
    stream.pipe(res);
  }
}
