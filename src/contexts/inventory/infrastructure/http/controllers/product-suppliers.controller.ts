import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';
import { GetProductSuppliersQuery } from '@contexts/inventory/application/queries/get-product-suppliers/get-product-suppliers.query';
import { AddProductSupplierCommand } from '@contexts/inventory/application/commands/add-product-supplier/add-product-supplier.command';
import { RemoveProductSupplierCommand } from '@contexts/inventory/application/commands/remove-product-supplier/remove-product-supplier.command';
import { SetPrimarySupplierCommand } from '@contexts/inventory/application/commands/set-primary-supplier/set-primary-supplier.command';
import { ProductSupplierOutputDto } from '@contexts/inventory/application/dtos/product-supplier-output.dto';
import { AddProductSupplierDto } from '../dtos/add-product-supplier.dto';

@ApiBearerAuth()
@ApiTags('Products')
@Controller('products/:productId/suppliers')
export class ProductSuppliersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @RequirePermissions(Permissions.PRODUCTS.READ)
  @ApiOperation({ summary: 'List suppliers linked to a product' })
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({ status: 200, type: [ProductSupplierOutputDto] })
  async getSuppliers(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ): Promise<ProductSupplierOutputDto[]> {
    return this.queryBus.execute(new GetProductSuppliersQuery(productId));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.PRODUCTS.UPDATE)
  @ApiOperation({ summary: 'Link a supplier to a product' })
  @ApiParam({ name: 'productId', type: String })
  @ApiBody({ type: AddProductSupplierDto })
  @ApiResponse({
    status: 201,
    description: 'Supplier linked successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product or supplier not found' })
  @ApiResponse({ status: 409, description: 'Supplier already linked' })
  async addSupplier(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() dto: AddProductSupplierDto,
  ) {
    await this.commandBus.execute(
      new AddProductSupplierCommand(productId, dto.supplierId, dto.isPrimary),
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Supplier linked to product successfully',
    };
  }

  @Patch(':productSupplierId/set-primary')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.PRODUCTS.UPDATE)
  @ApiOperation({ summary: 'Set a supplier as primary for a product' })
  @ApiParam({ name: 'productId', type: String })
  @ApiParam({ name: 'productSupplierId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Primary supplier updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'ProductSupplier not found' })
  async setPrimary(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Param('productSupplierId', new ParseUUIDPipe()) productSupplierId: string,
  ) {
    await this.commandBus.execute(
      new SetPrimarySupplierCommand(productId, productSupplierId),
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Primary supplier updated successfully',
    };
  }

  @Delete(':productSupplierId')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.PRODUCTS.UPDATE)
  @ApiOperation({ summary: 'Unlink a supplier from a product' })
  @ApiParam({ name: 'productId', type: String })
  @ApiParam({ name: 'productSupplierId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Supplier unlinked successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'ProductSupplier not found' })
  async removeSupplier(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Param('productSupplierId', new ParseUUIDPipe()) productSupplierId: string,
  ) {
    await this.commandBus.execute(
      new RemoveProductSupplierCommand(productId, productSupplierId),
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Supplier unlinked from product successfully',
    };
  }
}
