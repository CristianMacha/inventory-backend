import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import { GetBrandsQuery } from '@contexts/inventory/application/queries/get-brands/get-brands.query';
import { GetActiveBrandsQuery } from '@contexts/inventory/application/queries/get-active-brands/get-active-brands.query';
import { GetBrandByIdQuery } from '@contexts/inventory/application/queries/get-brand-by-id/get-brand-by-id.query';
import { IBrandOutputDto } from '@contexts/inventory/application/dtos/brand-output.dto';

@ApiBearerAuth()
@ApiTags('Brands')
@Controller('brands')
export class GetBrandsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.BRANDS.READ)
  @ApiOperation({ summary: 'Get all brands' })
  @ApiResponse({
    status: 200,
    description: 'Brands retrieved successfully',
    type: IBrandOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(): Promise<IBrandOutputDto[]> {
    return await this.queryBus.execute(new GetBrandsQuery());
  }

  @Get('active')
  @RequirePermissions(Permissions.BRANDS.READ)
  @ApiOperation({ summary: 'Get active brands for select dropdowns' })
  @ApiResponse({
    status: 200,
    description: 'Active brands',
    type: IBrandOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getActive(): Promise<IBrandOutputDto[]> {
    return await this.queryBus.execute(new GetActiveBrandsQuery());
  }

  @Get(':id')
  @RequirePermissions(Permissions.BRANDS.READ)
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Brand UUID' })
  @ApiResponse({ status: 200, type: IBrandOutputDto })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IBrandOutputDto> {
    return this.queryBus.execute(new GetBrandByIdQuery(id));
  }
}
