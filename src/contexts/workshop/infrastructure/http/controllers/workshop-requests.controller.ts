import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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

import { CreateWorkshopRequestCommand } from '../../../application/commands/create-workshop-request/create-workshop-request.command';
import { ApproveWorkshopRequestCommand } from '../../../application/commands/approve-workshop-request/approve-workshop-request.command';
import { RejectWorkshopRequestCommand } from '../../../application/commands/reject-workshop-request/reject-workshop-request.command';
import { GetWorkshopRequestsQuery } from '../../../application/queries/get-workshop-requests/get-workshop-requests.query';
import { GetProcurementNeedsQuery } from '../../../application/queries/get-procurement-needs/get-procurement-needs.query';
import { CreateWorkshopRequestDto } from '../dtos/create-workshop-request.dto';
import { RejectWorkshopRequestDto } from '../dtos/reject-workshop-request.dto';
import { WorkshopRequestDto } from '../../../application/dtos/workshop-request.dto';
import { ProcurementNeedsDto } from '../../../application/dtos/procurement-needs.dto';
import { RequestStatus } from '../../../domain/enums/request-status.enum';
import { RequestType } from '../../../domain/enums/request-type.enum';
import { RequestPriority } from '../../../domain/enums/request-priority.enum';
import { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@ApiBearerAuth()
@ApiTags('Workshop - Requests')
@Controller('workshop/requests')
export class WorkshopRequestsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.CREATE)
  @ApiOperation({
    summary: 'Create a new workshop request for a tool or material',
  })
  @ApiResponse({ status: 201, description: 'Request created successfully' })
  async create(
    @Body() dto: CreateWorkshopRequestDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new CreateWorkshopRequestCommand(
        dto.requestType,
        dto.itemId,
        user.id,
        dto.priority ?? RequestPriority.NORMAL,
        dto.quantity,
        dto.jobId,
        dto.notes,
      ),
    );
  }

  @Get('my')
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.CREATE)
  @ApiOperation({ summary: 'Get my own requests' })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  @ApiQuery({ name: 'requestType', required: false, enum: RequestType })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: WorkshopRequestDto, isArray: true })
  async findMine(
    @GetUser() user: AuthUserDto,
    @Query('status') status?: RequestStatus,
    @Query('requestType') requestType?: RequestType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<WorkshopRequestDto>> {
    return this.queryBus.execute(
      new GetWorkshopRequestsQuery(
        { status, requestType, requestedBy: user.id },
        normalizePaginationParams(page, limit),
      ),
    );
  }

  @Get('procurement-needs')
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({ summary: 'Get procurement needs dashboard' })
  @ApiResponse({ status: 200, type: ProcurementNeedsDto })
  async getProcurementNeeds(): Promise<ProcurementNeedsDto> {
    return this.queryBus.execute(new GetProcurementNeedsQuery());
  }

  @Get()
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.LIST)
  @ApiOperation({ summary: 'Get all workshop requests' })
  @ApiQuery({ name: 'status', required: false, enum: RequestStatus })
  @ApiQuery({ name: 'requestType', required: false, enum: RequestType })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: WorkshopRequestDto, isArray: true })
  async findAll(
    @Query('status') status?: RequestStatus,
    @Query('requestType') requestType?: RequestType,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginatedResult<WorkshopRequestDto>> {
    return this.queryBus.execute(
      new GetWorkshopRequestsQuery(
        { status, requestType },
        normalizePaginationParams(page, limit),
      ),
    );
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({ summary: 'Approve a workshop request' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Request approved successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async approve(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new ApproveWorkshopRequestCommand(id, user.id),
    );
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions(Permissions.WORKSHOP_REQUESTS.MANAGE)
  @ApiOperation({ summary: 'Reject a workshop request' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Request rejected successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async reject(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: RejectWorkshopRequestDto,
    @GetUser() user: AuthUserDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new RejectWorkshopRequestCommand(id, user.id, dto.rejectionReason),
    );
  }
}
