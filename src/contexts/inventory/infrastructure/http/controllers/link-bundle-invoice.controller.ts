import {
  Body,
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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { LinkBundleInvoiceCommand } from '@contexts/inventory/application/commands/link-bundle-invoice/link-bundle-invoice.command';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';

class LinkBundleInvoiceDto {
  @ApiProperty({ example: 'uuid-invoice' })
  @IsUUID()
  purchaseInvoiceId: string;
}

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
export class LinkBundleInvoiceController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch(':id/link-invoice')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.BUNDLES.UPDATE)
  @ApiOperation({
    summary: 'Link a bundle to a purchase invoice (null → invoice)',
  })
  @ApiParam({ name: 'id', type: String, description: 'Bundle ID' })
  @ApiBody({ type: LinkBundleInvoiceDto })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  @ApiResponse({ status: 404, description: 'Bundle or invoice not found' })
  @ApiResponse({
    status: 422,
    description:
      'Bundle already linked, invoice is CANCELLED, or supplier mismatch',
  })
  async run(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: LinkBundleInvoiceDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new LinkBundleInvoiceCommand(id, dto.purchaseInvoiceId, user.id),
    );
    return {
      statusCode: HttpStatus.OK,
      message: `Bundle ${id} linked to invoice ${dto.purchaseInvoiceId}`,
    };
  }
}
