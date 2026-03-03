import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { UnlinkBundleInvoiceCommand } from '@contexts/inventory/application/commands/unlink-bundle-invoice/unlink-bundle-invoice.command';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
export class UnlinkBundleInvoiceController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/unlink-invoice')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.BUNDLES.UPDATE)
  @ApiOperation({
    summary: 'Unlink a bundle from its purchase invoice (invoice → null)',
  })
  @ApiParam({ name: 'id', type: String, description: 'Bundle ID' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Bundle not found' })
  @ApiResponse({
    status: 422,
    description: 'Bundle not linked to any invoice, or has SOLD/RESERVED slabs',
  })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new UnlinkBundleInvoiceCommand(id, user.id));
    return {
      statusCode: HttpStatus.OK,
      message: `Bundle ${id} unlinked from its invoice`,
    };
  }
}
