import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetBrandsQuery } from '@contexts/inventory/application/queries/get-brands/get-brands.query';
import { IBrandOutputDto } from '@contexts/inventory/application/dtos/brand-output.dto';

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('brands')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetBrandsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.BRANDS.READ)
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({ status: 200, description: 'Brands retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks required permissions.',
  })
  async run(): Promise<IBrandOutputDto[]> {
    return await this.queryBus.execute(new GetBrandsQuery());
  }
}
