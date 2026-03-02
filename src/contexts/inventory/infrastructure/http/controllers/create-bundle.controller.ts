import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { CreateBundleCommand } from '../../../application/commands/create-bundle/create-bundle.command';
import { CreateBundleDto } from '../dtos/create-bundle.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
export class CreateBundleController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermissions(Permissions.BUNDLES.CREATE)
  @ApiOperation({ summary: 'Create a new bundle' })
  @ApiResponse({ status: 201, description: 'Bundle created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product or supplier not found' })
  async run(@Body() dto: CreateBundleDto, @GetUser() user: any): Promise<void> {
    await this.commandBus.execute(
      new CreateBundleCommand(
        dto.productId,
        user.id,
        dto.lotNumber,
        dto.thicknessCm,
        dto.supplierId,
        dto.purchaseInvoiceId,
      ),
    );
  }
}
