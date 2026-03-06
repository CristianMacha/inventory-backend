import {
  Controller,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { UploadSupplierReturnDocumentCommand } from '@contexts/purchasing/application/commands/upload-supplier-return-document/upload-supplier-return-document.command';
import { FileValidationPipe } from '@shared/storage/pipes/file-validation.pipe';
import { Permissions } from '@shared/authorization/permissions';

const DOCUMENT_MIME_TYPES = ['application/pdf', 'image/*'];
const MAX_20MB = 20 * 1024 * 1024;

@ApiBearerAuth()
@ApiTags('Supplier Returns')
@Controller('supplier-returns')
export class UploadSupplierReturnDocumentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':returnId/document')
  @HttpCode(200)
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.UPDATE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'PDF or image file (max 20MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload or replace the supplier return document' })
  @ApiResponse({ status: 200, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Supplier return not found' })
  async run(
    @Param('returnId') returnId: string,
    @UploadedFile(
      new FileValidationPipe({
        allowedMimeTypes: DOCUMENT_MIME_TYPES,
        maxSizeBytes: MAX_20MB,
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: AuthUserDto,
  ) {
    return this.commandBus.execute(
      new UploadSupplierReturnDocumentCommand(returnId, file, user.id),
    );
  }
}
