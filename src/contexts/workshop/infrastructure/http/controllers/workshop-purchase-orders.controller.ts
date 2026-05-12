import {
  Body,
  Controller,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import { normalizePaginationParams } from '@shared/domain/pagination/pagination-params.interface';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

import { CreateWorkshopPurchaseOrderCommand } from '../../../application/commands/create-workshop-purchase-order/create-workshop-purchase-order.command';
import {
  UpdatePurchaseOrderStatusCommand,
  PurchaseOrderStatusAction,
} from '../../../application/commands/update-purchase-order-status/update-purchase-order-status.command';
import { GetWorkshopPurchaseOrdersQuery } from '../../../application/queries/get-workshop-purchase-orders/get-workshop-purchase-orders.query';
import { GetWorkshopPurchaseOrderByIdQuery } from '../../../application/queries/get-workshop-purchase-order-by-id/get-workshop-purchase-order-by-id.query';
import { CreateWorkshopPurchaseOrderDto } from '../dtos/create-workshop-purchase-order.dto';
import { WorkshopPurchaseOrderDto } from '../../../application/dtos/workshop-purchase-order.dto';
import { PurchaseOrderStatus } from '../../../domain/enums/purchase-order-status.enum';

@ApiBearerAuth()
@ApiTags('Workshop - Purchase Orders')
@Controller('workshop/purchase-orders')
export class WorkshopPurchaseOrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({
    summary: 'Create a workshop purchase order from procurement needs',
  })
  @ApiResponse({ status: 201, description: 'Purchase order created' })
  async create(
    @Body() dto: CreateWorkshopPurchaseOrderDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new CreateWorkshopPurchaseOrderCommand(
        dto.supplierId,
        dto.items,
        user.id,
        dto.notes,
      ),
    );
  }

  @Get()
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({ summary: 'Get paginated list of workshop purchase orders' })
  @ApiQuery({ name: 'status', required: false, enum: PurchaseOrderStatus })
  @ApiQuery({ name: 'supplierId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: WorkshopPurchaseOrderDto, isArray: true })
  async findAll(
    @Query('status') status?: PurchaseOrderStatus,
    @Query('supplierId') supplierId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<WorkshopPurchaseOrderDto>> {
    return this.queryBus.execute(
      new GetWorkshopPurchaseOrdersQuery(
        { status, supplierId },
        normalizePaginationParams(page, limit),
      ),
    );
  }

  @Get(':id')
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({ summary: 'Get purchase order by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: WorkshopPurchaseOrderDto })
  @ApiResponse({ status: 404, description: 'Purchase order not found' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<WorkshopPurchaseOrderDto> {
    return this.queryBus.execute(new GetWorkshopPurchaseOrderByIdQuery(id));
  }

  @Patch(':id/send')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({ summary: 'Mark purchase order as sent to supplier' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async send(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdatePurchaseOrderStatusCommand(
        id,
        PurchaseOrderStatusAction.SEND,
        user.id,
      ),
    );
  }

  @Patch(':id/receive')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({ summary: 'Mark purchase order as received' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async receive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdatePurchaseOrderStatusCommand(
        id,
        PurchaseOrderStatusAction.RECEIVE,
        user.id,
      ),
    );
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({ summary: 'Cancel a purchase order' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async cancel(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdatePurchaseOrderStatusCommand(
        id,
        PurchaseOrderStatusAction.CANCEL,
        user.id,
      ),
    );
  }
}
