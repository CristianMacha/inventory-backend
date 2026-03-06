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
import { UploadInvoiceDocumentCommand } from '@contexts/purchasing/application/commands/upload-invoice-document/upload-invoice-document.command';
import { FileValidationPipe } from '@shared/storage/pipes/file-validation.pipe';
import { Permissions } from '@shared/authorization/permissions';

const DOCUMENT_MIME_TYPES = ['application/pdf', 'image/*'];
const MAX_20MB = 20 * 1024 * 1024;

@ApiBearerAuth()
@ApiTags('Purchase Invoices')
@Controller('purchase-invoices')
export class UploadInvoiceDocumentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(':invoiceId/document')
  @HttpCode(200)
  @RequirePermissions(Permissions.PURCHASE_INVOICES.UPDATE)
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
  @ApiOperation({ summary: 'Upload or replace the invoice document' })
  @ApiResponse({ status: 200, description: 'Document uploaded successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async run(
    @Param('invoiceId') invoiceId: string,
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
      new UploadInvoiceDocumentCommand(invoiceId, file, user.id),
    );
  }
}
