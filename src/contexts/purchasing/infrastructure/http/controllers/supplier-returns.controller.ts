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
  Query,
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
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { Permissions } from '@shared/authorization/permissions';
import { MessageResponseDto } from '@shared/http/dtos/message-response.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

import { CreateSupplierReturnCommand } from '../../../application/commands/create-supplier-return/create-supplier-return.command';
import { AddReturnItemCommand } from '../../../application/commands/add-return-item/add-return-item.command';
import { RemoveReturnItemCommand } from '../../../application/commands/remove-return-item/remove-return-item.command';
import { SendSupplierReturnCommand } from '../../../application/commands/send-supplier-return/send-supplier-return.command';
import { CreditSupplierReturnCommand } from '../../../application/commands/credit-supplier-return/credit-supplier-return.command';
import { CancelSupplierReturnCommand } from '../../../application/commands/cancel-supplier-return/cancel-supplier-return.command';
import { GetSupplierReturnsQuery } from '../../../application/queries/get-supplier-returns/get-supplier-returns.query';
import { GetSupplierReturnByIdQuery } from '../../../application/queries/get-supplier-return-by-id/get-supplier-return-by-id.query';
import {
  SupplierReturnOutputDto,
  SupplierReturnDetailOutputDto,
} from '../../../application/dtos/supplier-return-output.dto';
import { CreateSupplierReturnDto } from '../dtos/create-supplier-return.dto';
import { AddReturnItemDto } from '../dtos/add-return-item.dto';
import {
  GetSupplierReturnsQueryDto,
  toPaginationParams,
} from '../dtos/get-supplier-returns-query.dto';

@ApiBearerAuth()
@ApiTags('Supplier Returns')
@Controller('purchasing/supplier-returns')
export class SupplierReturnsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.CREATE)
  @ApiOperation({ summary: 'Create a new supplier return (nota de crédito)' })
  @ApiResponse({ status: 201, description: 'Supplier return created' })
  async create(
    @Body() dto: CreateSupplierReturnDto,
    @GetUser() user: AuthUserDto,
  ) {
    const id = await this.commandBus.execute(
      new CreateSupplierReturnCommand(
        dto.purchaseInvoiceId,
        dto.supplierId,
        new Date(dto.returnDate),
        dto.notes ?? '',
        user.id,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Supplier return created', id };
  }

  @Get()
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.LIST)
  @ApiOperation({ summary: 'List supplier returns with filters and pagination' })
  @ApiResponse({ status: 200, type: SupplierReturnOutputDto, isArray: true })
  async list(
    @Query() query: GetSupplierReturnsQueryDto,
  ): Promise<PaginatedResult<SupplierReturnOutputDto>> {
    return this.queryBus.execute(
      new GetSupplierReturnsQuery(
        toPaginationParams(query),
        query.supplierId,
        query.status,
        query.purchaseInvoiceId,
      ),
    );
  }

  @Get(':id')
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.READ)
  @ApiOperation({ summary: 'Get supplier return by ID with items' })
  @ApiParam({ name: 'id', description: 'Supplier return UUID' })
  @ApiResponse({ status: 200, type: SupplierReturnDetailOutputDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<SupplierReturnDetailOutputDto> {
    return this.queryBus.execute(new GetSupplierReturnByIdQuery(id));
  }

  @Post(':id/items')
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.UPDATE)
  @ApiOperation({ summary: 'Add a slab to a supplier return' })
  @ApiParam({ name: 'id', description: 'Supplier return UUID' })
  @ApiResponse({ status: 201, description: 'Item added' })
  async addItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AddReturnItemDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new AddReturnItemCommand(
        id,
        dto.slabId,
        dto.bundleId,
        dto.reason,
        dto.description ?? '',
        dto.unitCost,
        user.id,
      ),
    );
    return { statusCode: HttpStatus.CREATED, message: 'Item added to return' };
  }

  @Delete(':id/items/:itemId')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.UPDATE)
  @ApiOperation({ summary: 'Remove a slab from a supplier return' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async removeItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('itemId', new ParseUUIDPipe()) itemId: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new RemoveReturnItemCommand(id, itemId, user.id),
    );
    return { statusCode: HttpStatus.OK, message: 'Item removed from return' };
  }

  @Patch(':id/send')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.UPDATE)
  @ApiOperation({ summary: 'Send supplier return to supplier (DRAFT → SENT)' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async send(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new SendSupplierReturnCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Supplier return sent' };
  }

  @Patch(':id/credit')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.UPDATE)
  @ApiOperation({ summary: 'Mark supplier return as credited (SENT → CREDITED)' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async credit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new CreditSupplierReturnCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Supplier return credited' };
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.SUPPLIER_RETURNS.CANCEL)
  @ApiOperation({ summary: 'Cancel a supplier return' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(new CancelSupplierReturnCommand(id, user.id));
    return { statusCode: HttpStatus.OK, message: 'Supplier return cancelled' };
  }
}
