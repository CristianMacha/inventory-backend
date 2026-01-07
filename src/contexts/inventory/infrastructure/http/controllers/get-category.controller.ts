import { Controller, UseGuards, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { GetCategoriesQuery } from '@contexts/inventory/application/queries/get-categories/get-categories.query';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Permissions } from '@shared/authorization/permissions';
import { ICategoryOutputDto } from '@contexts/inventory/application/dtos/category-output.dto';

@ApiBearerAuth()
@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetCategoriesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.CATEGORIES.READ)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks required permissions.',
  })
  async run(): Promise<ICategoryOutputDto[]> {
    return await this.queryBus.execute(new GetCategoriesQuery());
  }
}
