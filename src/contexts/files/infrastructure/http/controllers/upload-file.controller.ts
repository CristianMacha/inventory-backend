import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';
import { OrgAccessGuard } from '@contexts/files/infrastructure/guards/org-access.guard';
import { FileValidationPipe } from '@shared/storage/pipes/file-validation.pipe';
import { UploadFileCommand } from '@contexts/files/application/commands/upload-file/upload-file.command';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_MIME_TYPES = [
  'image/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-zip-compressed',
];

@ApiBearerAuth()
@ApiTags('Files')
@UseGuards(OrgAccessGuard)
@Controller('files/folders')
export class UploadFileController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':folderId/upload')
  @RequirePermissions(Permissions.FILES.UPLOAD)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a file to a folder',
    description:
      'Uploads a file to Firebase Storage and registers it in the specified folder. Max file size: 50 MB. Allowed types: images, PDF, Word, Excel, CSV, TXT, ZIP.',
  })
  @ApiParam({
    name: 'folderId',
    description: 'Target folder UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'organizationId',
    required: true,
    description: 'Organization UUID that owns the folder',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'File to upload (images, PDF, Word, Excel, CSV, TXT, ZIP — max 50 MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded. Returns the new file ID.',
    schema: { example: { id: 'uuid' } },
  })
  @ApiResponse({
    status: 400,
    description: 'No file provided, invalid MIME type, or file exceeds 50 MB.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires files.upload permission. Also returns 403 if the organizationId does not belong to the authenticated user.',
  })
  @ApiResponse({
    status: 404,
    description: 'Folder or organization not found.',
  })
  @ApiResponse({
    status: 422,
    description: 'Storage quota exceeded for this organization.',
  })
  async run(
    @Param('folderId', new ParseUUIDPipe()) folderId: string,
    @Query('organizationId') organizationId: string,
    @UploadedFile(
      new FileValidationPipe({
        allowedMimeTypes: ALLOWED_MIME_TYPES,
        maxSizeBytes: MAX_FILE_SIZE,
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: AuthUserDto,
  ): Promise<{ id: string }> {
    return this.commandBus.execute(
      new UploadFileCommand(file, folderId, organizationId, user.id),
    );
  }
}
