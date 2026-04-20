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
import { GetCategoriesQuery } from '@contexts/inventory/application/queries/get-categories/get-categories.query';
import { GetActiveCategoriesQuery } from '@contexts/inventory/application/queries/get-active-categories/get-active-categories.query';
import { GetCategoryByIdQuery } from '@contexts/inventory/application/queries/get-category-by-id/get-category-by-id.query';
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

  @Get(':id')
  @RequirePermissions(Permissions.CATEGORIES.READ)
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Category UUID' })
  @ApiResponse({ status: 200, type: ICategoryOutputDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ICategoryOutputDto> {
    return this.queryBus.execute(new GetCategoryByIdQuery(id));
  }
}
