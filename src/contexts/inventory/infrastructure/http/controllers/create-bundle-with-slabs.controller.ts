import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { CreateBundleWithSlabsCommand } from '../../../application/commands/create-bundle-with-slabs/create-bundle-with-slabs.command';
import { CreateBundleWithSlabsResult } from '../../../application/commands/create-bundle-with-slabs/create-bundle-with-slabs.handler';
import { CreateBundleWithSlabsDto } from '../dtos/create-bundle-with-slabs.dto';
import { BundleWithSlabsOutputDto } from '../../../application/dtos/bundle-with-slabs-output.dto';
import { BundleResponseMapper } from '../../../application/mappers/bundle-response.mapper';
import { SlabResponseMapper } from '../../../application/mappers/slab-response.mapper';

@ApiBearerAuth()
@ApiTags('Bundles')
@Controller('bundles')
export class CreateBundleWithSlabsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('with-slabs')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.BUNDLES.CREATE, Permissions.SLABS.CREATE)
  @ApiOperation({ summary: 'Create a bundle together with multiple slabs' })
  @ApiResponse({
    status: 201,
    description: 'Bundle and slabs created successfully',
    type: BundleWithSlabsOutputDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product or supplier not found.' })
  async run(
    @Body() dto: CreateBundleWithSlabsDto,
    @GetUser() user: any,
  ): Promise<BundleWithSlabsOutputDto> {
    const result: CreateBundleWithSlabsResult = await this.commandBus.execute(
      new CreateBundleWithSlabsCommand(
        dto.productId,
        (user as { id: string }).id,
        dto.slabs,
        dto.lotNumber,
        dto.thicknessCm,
        dto.supplierId,
        dto.purchaseInvoiceId,
      ),
    );

    return {
      bundle: BundleResponseMapper.toResponse(
        result.bundle,
        result.productName,
        result.supplierName,
        result.invoiceNumber,
      ),
      slabs: result.slabs.map((slab) => SlabResponseMapper.toResponse(slab)),
    };
  }
}
