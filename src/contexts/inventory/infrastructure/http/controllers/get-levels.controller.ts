import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetLevelsQuery } from '../../../application/queries/get-levels/get-levels.query';
import { GetActiveLevelsQuery } from '../../../application/queries/get-active-levels/get-active-levels.query';
import { ILevelOutputDto } from '../../../application/dtos/level-output.dto';

@ApiBearerAuth()
@ApiTags('Levels')
@Controller('levels')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetLevelsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.LEVELS.LIST)
  @ApiOperation({ summary: 'Get all levels' })
  @ApiResponse({
    status: 200,
    description: 'Levels retrieved successfully',
    type: ILevelOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(): Promise<ILevelOutputDto[]> {
    return this.queryBus.execute(new GetLevelsQuery());
  }

  @Get('active')
  @RequirePermissions(Permissions.LEVELS.LIST)
  @ApiOperation({ summary: 'Get active levels for select dropdowns' })
  @ApiResponse({
    status: 200,
    description: 'Active levels',
    type: ILevelOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getActive(): Promise<ILevelOutputDto[]> {
    return this.queryBus.execute(new GetActiveLevelsQuery());
  }
}
