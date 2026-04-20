import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetFinishesQuery } from '../../../application/queries/get-finishes/get-finishes.query';
import { GetActiveFinishesQuery } from '../../../application/queries/get-active-finishes/get-active-finishes.query';
import { GetFinishByIdQuery } from '../../../application/queries/get-finish-by-id/get-finish-by-id.query';
import { IFinishOutputDto } from '../../../application/dtos/finish-output.dto';

@ApiBearerAuth()
@ApiTags('Finishes')
@Controller('finishes')
export class GetFinishesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.FINISHES.LIST)
  @ApiOperation({ summary: 'Get all finishes' })
  @ApiResponse({
    status: 200,
    description: 'Finishes retrieved successfully',
    type: IFinishOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(): Promise<IFinishOutputDto[]> {
    return this.queryBus.execute(new GetFinishesQuery());
  }

  @Get('active')
  @RequirePermissions(Permissions.FINISHES.LIST)
  @ApiOperation({ summary: 'Get active finishes for select dropdowns' })
  @ApiResponse({
    status: 200,
    description: 'Active finishes',
    type: IFinishOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getActive(): Promise<IFinishOutputDto[]> {
    return this.queryBus.execute(new GetActiveFinishesQuery());
  }

  @Get(':id')
  @RequirePermissions(Permissions.FINISHES.LIST)
  @ApiOperation({ summary: 'Get finish by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Finish UUID' })
  @ApiResponse({ status: 200, type: IFinishOutputDto })
  @ApiResponse({ status: 404, description: 'Finish not found' })
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IFinishOutputDto> {
    return this.queryBus.execute(new GetFinishByIdQuery(id));
  }
}
