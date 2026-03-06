import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUsersQuery } from '../../../application/queries/get-users/get-users.query';
import { UserOutputDto } from '@contexts/users/application/dtos/user.output.dto';
import { UserPresentationDto } from '../dtos/user-presentation.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { Permissions } from '@shared/authorization/permissions';
import {
  GetUsersQueryDto,
  toPaginationParams,
} from '../dtos/get-users-query.dto';
import type { PaginatedResult } from '@shared/domain/pagination/paginated-result.interface';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class GetUsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.USERS.READ)
  @ApiOperation({
    summary: 'Get paginated users with optional search and role filter',
  })
  @ApiOkResponse({
    type: UserPresentationDto,
    description: 'Paginated list of users with their roles',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Requires users.read permission.',
  })
  async findAll(
    @Query() query: GetUsersQueryDto,
  ): Promise<PaginatedResult<UserOutputDto>> {
    return this.queryBus.execute(
      new GetUsersQuery(toPaginationParams(query), query.search, query.roleId),
    );
  }
}
