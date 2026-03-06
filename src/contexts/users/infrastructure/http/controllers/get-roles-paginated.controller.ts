import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetRolesPaginatedQuery } from '../../../application/queries/get-roles-paginated/get-roles-paginated.query';
import { RoleOutputDto } from '../../../application/dtos/role.output.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  MAX_LIMIT,
  normalizePaginationParams,
} from '@shared/domain/pagination/pagination-params.interface';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

class GetRolesPaginatedQueryDto {
  @ApiPropertyOptional({ description: 'Search by role name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ default: DEFAULT_PAGE, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    default: DEFAULT_LIMIT,
    minimum: 1,
    maximum: MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;
}

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class GetRolesPaginatedController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('paginated')
  @RequirePermissions(Permissions.ROLES.READ)
  @ApiOperation({ summary: 'Get paginated roles with optional search' })
  @ApiOkResponse({
    type: RoleOutputDto,
    description: 'Paginated list of roles with their permissions',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires roles.read permission.',
  })
  async run(
    @Query() query: GetRolesPaginatedQueryDto,
  ): Promise<PaginatedResult<RoleOutputDto>> {
    return this.queryBus.execute(
      new GetRolesPaginatedQuery(
        normalizePaginationParams(query.page, query.limit),
        query.search,
      ),
    );
  }
}
