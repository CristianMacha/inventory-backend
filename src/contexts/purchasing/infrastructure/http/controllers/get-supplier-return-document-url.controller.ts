import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { GetSupplierReturnDocumentUrlQuery } from '@contexts/purchasing/application/queries/get-supplier-return-document-url/get-supplier-return-document-url.query';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Supplier Returns')
@Controller('supplier-returns')
export class GetSupplierReturnDocumentUrlController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':returnId/document-url')
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.READ)
  @ApiOperation({
    summary: 'Get a signed URL for the supplier return document (valid 1h)',
  })
  @ApiResponse({ status: 200, description: 'Returns signed URL' })
  @ApiResponse({
    status: 404,
    description: 'Supplier return or document not found',
  })
  async run(@Param('returnId') returnId: string) {
    return this.queryBus.execute(
      new GetSupplierReturnDocumentUrlQuery(returnId),
    );
  }
}
