import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

import { CreatePurchaseInvoiceCommand } from '../../../application/commands/create-purchase-invoice/create-purchase-invoice.command';
import { AddInvoiceItemCommand } from '../../../application/commands/add-invoice-item/add-invoice-item.command';
import { RemoveInvoiceItemCommand } from '../../../application/commands/remove-invoice-item/remove-invoice-item.command';
import { ReceiveInvoiceCommand } from '../../../application/commands/receive-invoice/receive-invoice.command';
import { PayInvoiceCommand } from '../../../application/commands/pay-invoice/pay-invoice.command';
import { CancelInvoiceCommand } from '../../../application/commands/cancel-invoice/cancel-invoice.command';
import { GetPurchaseInvoicesQuery } from '../../../application/queries/get-purchase-invoices/get-purchase-invoices.query';
import { GetPurchaseInvoiceByIdQuery } from '../../../application/queries/get-purchase-invoice-by-id/get-purchase-invoice-by-id.query';
import { GetBundleCostSummaryQuery } from '../../../application/queries/get-bundle-cost-summary/get-bundle-cost-summary.query';
import { GetPurchaseInvoicesSelectQuery } from '../../../application/queries/get-purchase-invoices-select/get-purchase-invoices-select.query';
import {
  PurchaseInvoiceOutputDto,
  PurchaseInvoiceDetailOutputDto,
} from '../../../application/dtos/purchase-invoice-output.dto';
import { PurchaseInvoiceSelectOutputDto } from '../../../application/dtos/purchase-invoice-select-output.dto';
import { CreatePurchaseInvoiceDto } from '../dtos/create-purchase-invoice.dto';
import { AddInvoiceItemDto } from '../dtos/add-invoice-item.dto';
import {
  GetPurchaseInvoicesQueryDto,
  toPaginationParams,
} from '../dtos/get-purchase-invoices-query.dto';
import { GetPurchaseInvoicesSelectQueryDto } from '../dtos/get-purchase-invoices-select-query.dto';
import type { BundleCostSummary } from '../../../domain/repositories/purchase-invoice.repository';

@ApiBearerAuth()
@ApiTags('Purchase Invoices')
@Controller('purchase-invoices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PurchaseInvoicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermissions(Permissions.PURCHASE_INVOICES.CREATE)
  @ApiOperation({ summary: 'Create a new purchase invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created' })
  @ApiResponse({ status: 409, description: 'Invoice number already exists' })
  async create(
    @Body() dto: CreatePurchaseInvoiceDto,
    @GetUser() user: AuthUserDto,
  ) {
    const id = await this.commandBus.execute(
      new CreatePurchaseInvoiceCommand(
        dto.invoiceNumber,
        dto.supplierId,
        new Date(dto.invoiceDate),
        user.id,
        dto.dueDate ? new Date(dto.dueDate) : null,
        dto.notes,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Invoice created', id };
  }

  @Get()
  @RequirePermissions(Permissions.PURCHASE_INVOICES.READ)
  @ApiOperation({
    summary: 'List purchase invoices with filters and pagination',
  })
  @ApiResponse({ status: 200, type: PurchaseInvoiceOutputDto, isArray: true })
  async list(
    @Query() query: GetPurchaseInvoicesQueryDto,
  ): Promise<PaginatedResult<PurchaseInvoiceOutputDto>> {
    return this.queryBus.execute(
      new GetPurchaseInvoicesQuery(
        toPaginationParams(query),
        query.supplierId,
        query.status,
        query.search,
      ),
    );
  }

  @Get('bundle-cost/:bundleId')
  @RequirePermissions(Permissions.PURCHASE_INVOICES.READ)
  @ApiOperation({
    summary: 'Get cost summary for a bundle across all invoices',
  })
  @ApiParam({ name: 'bundleId', description: 'Bundle UUID' })
  @ApiResponse({ status: 200, description: 'Bundle cost summary' })
  async getBundleCost(
    @Param('bundleId', new ParseUUIDPipe()) bundleId: string,
  ): Promise<BundleCostSummary | null> {
    return this.queryBus.execute(new GetBundleCostSummaryQuery(bundleId));
  }

  @Get('select')
  @RequirePermissions(Permissions.PURCHASE_INVOICES.READ)
  @ApiOperation({ summary: 'List purchase invoices for select dropdowns (excludes DRAFT and CANCELLED)' })
  @ApiResponse({ status: 200, type: PurchaseInvoiceSelectOutputDto, isArray: true })
  async getForSelect(
    @Query() query: GetPurchaseInvoicesSelectQueryDto,
  ): Promise<PurchaseInvoiceSelectOutputDto[]> {
    return this.queryBus.execute(
      new GetPurchaseInvoicesSelectQuery(query.supplierId, query.status),
    );
  }

  @Get(':id')
  @RequirePermissions(Permissions.PURCHASE_INVOICES.READ)
  @ApiOperation({ summary: 'Get purchase invoice by ID with items' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({ status: 200, type: PurchaseInvoiceDetailOutputDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PurchaseInvoiceDetailOutputDto> {
    return this.queryBus.execute(new GetPurchaseInvoiceByIdQuery(id));
  }

  @Post(':id/items')
  @RequirePermissions(Permissions.PURCHASE_INVOICES.UPDATE)
  @ApiOperation({ summary: 'Add an item to a purchase invoice' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiResponse({ status: 201, description: 'Item added' })
  async addItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddInvoiceItemDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new AddInvoiceItemCommand(
        id,
        dto.bundleId,
        dto.concept,
        dto.description ?? '',
        dto.unitCost,
        dto.quantity,
        user.id,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Item added to invoice' };
  }

  @Delete(':id/items/:itemId')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.PURCHASE_INVOICES.UPDATE)
  @ApiOperation({ summary: 'Remove an item from a purchase invoice' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async removeItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new RemoveInvoiceItemCommand(id, itemId, user.id),
    );
    return { statusCode: HttpStatus.OK, message: 'Item removed from invoice' };
  }

  @Patch(':id/receive')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.PURCHASE_INVOICES.UPDATE)
  @ApiOperation({ summary: 'Mark invoice as received' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async receive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new ReceiveInvoiceCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Invoice marked as received' };
  }

  @Patch(':id/pay')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.PURCHASE_INVOICES.UPDATE)
  @ApiOperation({ summary: 'Mark invoice as paid' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async pay(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new PayInvoiceCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Invoice marked as paid' };
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.PURCHASE_INVOICES.UPDATE)
  @ApiOperation({ summary: 'Cancel a purchase invoice' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new CancelInvoiceCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Invoice cancelled' };
  }
}
