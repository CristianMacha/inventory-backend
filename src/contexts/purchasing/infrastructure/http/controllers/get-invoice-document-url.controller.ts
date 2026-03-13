import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { GetInvoiceDocumentUrlQuery } from '@contexts/purchasing/application/queries/get-invoice-document-url/get-invoice-document-url.query';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Purchase Invoices')
@Controller('purchase-invoices')
export class GetInvoiceDocumentUrlController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':invoiceId/document-url')
  @RequirePermissions(Permissions.PURCHASE_INVOICES.READ)
  @ApiOperation({
    summary: 'Get a signed URL for the invoice document (valid 1h)',
  })
  @ApiResponse({ status: 200, description: 'Returns signed URL' })
  @ApiResponse({ status: 404, description: 'Invoice or document not found' })
  async run(@Param('invoiceId') invoiceId: string): Promise<{ url: string }> {
    return this.queryBus.execute(new GetInvoiceDocumentUrlQuery(invoiceId));
  }
}
