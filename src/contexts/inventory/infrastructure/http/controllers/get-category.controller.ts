import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { GetCategoriesQuery } from '@contexts/inventory/application/queries/get-categories/get-categories.query';
import { GetActiveCategoriesQuery } from '@contexts/inventory/application/queries/get-active-categories/get-active-categories.query';
import { ICategoryOutputDto } from '@contexts/inventory/application/dtos/category-output.dto';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
export class GetCategoriesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.CATEGORIES.READ)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: ICategoryOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async run(): Promise<ICategoryOutputDto[]> {
    return await this.queryBus.execute(new GetCategoriesQuery());
  }

  @Get('active')
  @RequirePermissions(Permissions.CATEGORIES.READ)
  @ApiOperation({ summary: 'Get active categories for select dropdowns' })
  @ApiResponse({
    status: 200,
    description: 'Active categories',
    type: ICategoryOutputDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getActive(): Promise<ICategoryOutputDto[]> {
    return await this.queryBus.execute(new GetActiveCategoriesQuery());
  }
}
