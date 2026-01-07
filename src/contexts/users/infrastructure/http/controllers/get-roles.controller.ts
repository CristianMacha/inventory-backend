import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { GetRolesQuery } from '../../../application/queries/get-roles/get-roles.query';
import { RoleOutputDto } from '../../../application/dtos/role.output.dto';
import { RequirePermissions } from '@contexts/auth/infrastructure/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '@contexts/auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from '@contexts/auth/infrastructure/guards/permissions.guard';
import { Permissions } from '@shared/authorization/permissions';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GetRolesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions(Permissions.ROLES.READ)
  @ApiOperation({ summary: 'List all roles with their permissions' })
  @ApiResponse({
    status: 200,
    description: 'List of roles',
    type: [RoleOutputDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Valid JWT token required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User lacks required permissions.',
  })
  async run(): Promise<RoleOutputDto[]> {
    return this.queryBus.execute(new GetRolesQuery());
  }
}
