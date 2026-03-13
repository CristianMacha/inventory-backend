import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { GetSlabsQuery } from '../../../application/queries/get-slabs/get-slabs.query';
import { GetReturnableSlabsQuery } from '../../../application/queries/get-returnable-slabs/get-returnable-slabs.query';
import { ISlabOutputDto } from '../../../application/dtos/slab-output.dto';
import { SlabReturnableOutputDto } from '../../../application/dtos/slab-returnable-output.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import {
  GetSlabsQueryDto,
  toPaginationParams,
} from '../dtos/get-slabs-query.dto';
import { GetReturnableSlabsQueryDto } from '../dtos/get-returnable-slabs-query.dto';
import { CreateRemnantSlabDto } from '../dtos/create-remnant-slab.dto';
import { CreateRemnantSlabCommand } from '../../../application/commands/create-remnant-slab/create-remnant-slab.command';
import { GetUser } from '@contexts/auth/infrastructure/decorators/get-user.decorator';
import { AuthUserDto } from '@contexts/users/application/dtos/user-types.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@ApiBearerAuth()
@ApiTags('Slabs')
@Controller('slabs')
export class GetSlabsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @RequirePermissions(Permissions.SLABS.LIST)
  @ApiOperation({
    summary: 'Get slabs with pagination and optional filter by bundle',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated slabs',
    type: ISlabOutputDto,
    isArray: true,
  })
  async run(
    @Query() query: GetSlabsQueryDto,
  ): Promise<PaginatedResult<ISlabOutputDto>> {
    return this.queryBus.execute(
      new GetSlabsQuery(
        toPaginationParams(query),
        query.bundleId,
        query.status,
        query.search,
        query.isRemnant,
      ),
    );
  }

  @Get('returnable')
  @RequirePermissions(Permissions.SLABS.LIST)
  @ApiOperation({
    summary:
      'List slabs eligible for a supplier return (AVAILABLE or RESERVED) filtered by purchase invoice',
  })
  @ApiResponse({
    status: 200,
    type: SlabReturnableOutputDto,
    isArray: true,
  })
  async getReturnable(
    @Query() query: GetReturnableSlabsQueryDto,
  ): Promise<SlabReturnableOutputDto[]> {
    return this.queryBus.execute(
      new GetReturnableSlabsQuery(query.purchaseInvoiceId, query.bundleId),
    );
  }

  @Post(':slabId/remnant')
  @RequirePermissions(Permissions.SLABS.CREATE)
  @ApiOperation({ summary: 'Create a remnant slab from a SOLD slab' })
  @ApiResponse({
    status: 201,
    description: 'Remnant slab created successfully',
    schema: { properties: { id: { type: 'string' } } },
  })
  @ApiResponse({ status: 404, description: 'Parent slab not found' })
  @ApiResponse({
    status: 422,
    description: 'Parent slab is not SOLD or is already a remnant',
  })
  async createRemnant(
    @Param('slabId') slabId: string,
    @Body() dto: CreateRemnantSlabDto,
    @GetUser() user: AuthUserDto,
  ) {
    await this.commandBus.execute(
      new CreateRemnantSlabCommand(
        slabId,
        dto.code,
        dto.widthCm,
        dto.heightCm,
        user.id,
        dto.description,
      ),
    );
  }
}
